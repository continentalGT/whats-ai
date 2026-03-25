import difflib
import heapq
import math
import re
from typing import Any, Dict, List, Optional

import numpy as np
from app.core.config import settings

# ── Shared embeddings client (reused from nlp_service pattern) ──
_embeddings_client = None


def _get_embeddings_client():
    from azure.ai.inference import EmbeddingsClient
    from azure.core.credentials import AzureKeyCredential

    global _embeddings_client
    if _embeddings_client is None:
        endpoint = settings.azure_openai_endpoint.rstrip("/")
        deployment = settings.azure_openai_embedding_deployment
        _embeddings_client = EmbeddingsClient(
            endpoint=f"{endpoint}/openai/deployments/{deployment}",
            credential=AzureKeyCredential(settings.azure_openai_key),
        )
    return _embeddings_client


def _cosine_similarity(a: List[float], b: List[float]) -> float:
    a_arr = np.array(a)
    b_arr = np.array(b)
    denom = np.linalg.norm(a_arr) * np.linalg.norm(b_arr)
    if denom == 0:
        return 0.0
    return float(np.dot(a_arr, b_arr) / denom)


# ── 1. Semantic Search ───────────────────────────────────────
def semantic_search(sentences: List[str], query: str, k: int) -> dict:
    client = _get_embeddings_client()
    all_texts = [query] + sentences
    response = client.embed(input=all_texts)
    embeddings = [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
    query_emb = embeddings[0]
    sent_embs = embeddings[1:]

    scored = [
        {"sentence": s, "score": round(_cosine_similarity(query_emb, sent_embs[i]), 4), "rank": 0}
        for i, s in enumerate(sentences)
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    top_k = scored[:k] if k > 0 else scored
    for i, r in enumerate(top_k):
        r["rank"] = i + 1

    return {
        "query": query,
        "k": k,
        "results": top_k,
        "model": f"azure-foundry/{settings.azure_openai_embedding_deployment}",
    }


# ── 2. Keyword Search ────────────────────────────────────────
def keyword_search(documents: List[str], keyword: str, case_sensitive: bool = False) -> dict:
    matches = []
    for i, doc in enumerate(documents):
        search_doc = doc if case_sensitive else doc.lower()
        search_kw = keyword if case_sensitive else keyword.lower()
        pos = search_doc.find(search_kw)
        while pos != -1:
            matches.append({"document": doc, "index": i, "position": pos})
            pos = search_doc.find(search_kw, pos + len(search_kw))

    return {
        "keyword": keyword,
        "matches": matches,
        "total_matches": len(matches),
        "total_documents": len(documents),
    }


# ── 3. Linear Search ─────────────────────────────────────────
def linear_search(items: List[str], target: str) -> dict:
    steps = []
    found = False
    found_at = None
    for i, item in enumerate(items):
        match = item.strip().lower() == target.strip().lower()
        steps.append({"index": i, "item": item, "match": match})
        if match:
            found = True
            found_at = i
            break

    return {
        "target": target,
        "steps": steps,
        "found": found,
        "found_at": found_at,
        "comparisons": len(steps),
    }


# ── 4. Binary Search ─────────────────────────────────────────
def binary_search(items: List[float], target: float) -> dict:
    sorted_items = sorted(items)
    low, high = 0, len(sorted_items) - 1
    steps = []
    found = False
    found_at = None

    while low <= high:
        mid = (low + high) // 2
        mid_value = sorted_items[mid]
        if mid_value == target:
            steps.append({"low": low, "high": high, "mid": mid, "mid_value": mid_value, "comparison": "equal"})
            found = True
            found_at = mid
            break
        elif target < mid_value:
            steps.append({"low": low, "high": high, "mid": mid, "mid_value": mid_value, "comparison": "go_left"})
            high = mid - 1
        else:
            steps.append({"low": low, "high": high, "mid": mid, "mid_value": mid_value, "comparison": "go_right"})
            low = mid + 1

    return {
        "target": target,
        "sorted_items": sorted_items,
        "steps": steps,
        "found": found,
        "found_at": found_at,
        "comparisons": len(steps),
    }


# ── 5. Heuristic Search (A*) — Romania map ───────────────────
_GRAPH: Dict[str, List[tuple]] = {
    "Arad":      [("Zerind", 75), ("Sibiu", 140), ("Timisoara", 118)],
    "Zerind":    [("Arad", 75), ("Oradea", 71)],
    "Oradea":    [("Zerind", 71), ("Sibiu", 151)],
    "Sibiu":     [("Arad", 140), ("Oradea", 151), ("Fagaras", 99), ("Rimnicu", 80)],
    "Timisoara": [("Arad", 118), ("Lugoj", 111)],
    "Lugoj":     [("Timisoara", 111), ("Mehadia", 70)],
    "Mehadia":   [("Lugoj", 70), ("Drobeta", 75)],
    "Drobeta":   [("Mehadia", 75), ("Craiova", 120)],
    "Craiova":   [("Drobeta", 120), ("Rimnicu", 146), ("Pitesti", 138)],
    "Rimnicu":   [("Sibiu", 80), ("Craiova", 146), ("Pitesti", 97)],
    "Fagaras":   [("Sibiu", 99), ("Bucharest", 211)],
    "Pitesti":   [("Rimnicu", 97), ("Craiova", 138), ("Bucharest", 101)],
    "Bucharest": [("Fagaras", 211), ("Pitesti", 101), ("Giurgiu", 90), ("Urziceni", 85)],
    "Giurgiu":   [("Bucharest", 90)],
    "Urziceni":  [("Bucharest", 85), ("Hirsova", 98), ("Vaslui", 142)],
    "Hirsova":   [("Urziceni", 98), ("Eforie", 86)],
    "Eforie":    [("Hirsova", 86)],
    "Vaslui":    [("Urziceni", 142), ("Iasi", 92)],
    "Iasi":      [("Vaslui", 92), ("Neamt", 87)],
    "Neamt":     [("Iasi", 87)],
}

# Straight-line distances to Bucharest (admissible heuristic)
_SLD_BUCHAREST: Dict[str, float] = {
    "Arad": 366, "Bucharest": 0, "Craiova": 160, "Drobeta": 242,
    "Eforie": 161, "Fagaras": 176, "Giurgiu": 77, "Hirsova": 151,
    "Iasi": 226, "Lugoj": 244, "Mehadia": 241, "Neamt": 234,
    "Oradea": 380, "Pitesti": 100, "Rimnicu": 193, "Sibiu": 253,
    "Timisoara": 329, "Urziceni": 80, "Vaslui": 199, "Zerind": 374,
}


def heuristic_search(start: str, goal: str) -> dict:
    graph_nodes = sorted(_GRAPH.keys())

    if start not in _GRAPH or goal not in _GRAPH:
        return {"path": [], "total_cost": 0.0, "steps": [], "found": False, "graph_nodes": graph_nodes}

    # A* — heuristic is SLD to Bucharest only; falls back to 0 for other goals
    use_heuristic = goal == "Bucharest"

    def h(node: str) -> float:
        return _SLD_BUCHAREST.get(node, 0.0) if use_heuristic else 0.0

    open_heap = [(h(start), 0.0, start, [start])]
    g_scores: Dict[str, float] = {start: 0.0}
    closed: set = set()
    steps = []

    while open_heap:
        f, g, current, path = heapq.heappop(open_heap)
        if current in closed:
            continue

        steps.append({
            "current": current,
            "open_list": [item[2] for item in open_heap],
            "closed_list": sorted(closed),
            "f_score": round(f, 2),
            "g_score": round(g, 2),
            "h_score": round(h(current), 2),
        })

        if current == goal:
            return {
                "path": path,
                "total_cost": round(g, 2),
                "steps": steps,
                "found": True,
                "graph_nodes": graph_nodes,
            }

        closed.add(current)

        for neighbor, cost in _GRAPH.get(current, []):
            if neighbor in closed:
                continue
            new_g = g + cost
            if neighbor not in g_scores or new_g < g_scores[neighbor]:
                g_scores[neighbor] = new_g
                f_new = new_g + h(neighbor)
                heapq.heappush(open_heap, (f_new, new_g, neighbor, path + [neighbor]))

    return {"path": [], "total_cost": 0.0, "steps": steps, "found": False, "graph_nodes": graph_nodes}


# ── 6. Fuzzy Search ──────────────────────────────────────────
def fuzzy_search(items: List[str], query: str, threshold: float = 0.4) -> dict:
    results = []
    for item in items:
        ratio = difflib.SequenceMatcher(None, query.lower(), item.lower()).ratio()
        if ratio >= threshold:
            results.append({"item": item, "similarity": round(ratio, 4)})
    results.sort(key=lambda x: x["similarity"], reverse=True)

    return {"query": query, "results": results, "threshold": threshold}


# ── 7. Full-Text Search (TF-IDF) ─────────────────────────────
def _tokenize(text: str) -> List[str]:
    return re.findall(r"\b\w+\b", text.lower())


def full_text_search(documents: List[str], query: str) -> dict:
    query_terms = list(set(_tokenize(query)))
    n = len(documents)

    tf_list = []
    for doc in documents:
        tokens = _tokenize(doc)
        tf: Dict[str, float] = {}
        if tokens:
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            for t in tf:
                tf[t] /= len(tokens)
        tf_list.append(tf)

    df: Dict[str, int] = {}
    for tf in tf_list:
        for t in tf:
            df[t] = df.get(t, 0) + 1

    results = []
    for i, (doc, tf) in enumerate(zip(documents, tf_list)):
        score = 0.0
        matched: List[str] = []
        for term in query_terms:
            if term in tf:
                idf = math.log((n + 1) / (df.get(term, 0) + 1))
                score += tf[term] * idf
                matched.append(term)
        if score > 0:
            results.append({"document": doc, "index": i, "score": round(score, 4), "matched_terms": matched})

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"query": query, "results": results, "total_documents": n}


# ── 8. Faceted Search ────────────────────────────────────────
def faceted_search(items: List[Dict[str, Any]], filters: Dict[str, Any]) -> dict:
    available_facets: Dict[str, set] = {}
    for item in items:
        for k, v in item.items():
            available_facets.setdefault(k, set()).add(str(v))
    sorted_facets = {k: sorted(v) for k, v in available_facets.items()}

    matched = []
    for item in items:
        if all(str(item.get(k, "")).lower() == str(v).lower() for k, v in filters.items()):
            matched.append(item)

    return {
        "total_items": len(items),
        "matched_items": matched,
        "matched_count": len(matched),
        "filters_applied": filters,
        "available_facets": sorted_facets,
    }
