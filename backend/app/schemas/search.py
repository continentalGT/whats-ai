from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# ── Semantic Search ──────────────────────────────────────────
class SemanticSearchRequest(BaseModel):
    sentences: List[str]
    query: str
    k: int = 5


class SemanticSearchResult(BaseModel):
    sentence: str
    score: float
    rank: int


class SemanticSearchResponse(BaseModel):
    query: str
    k: int
    results: List[SemanticSearchResult]
    model: str


# ── Keyword Search ───────────────────────────────────────────
class KeywordSearchRequest(BaseModel):
    documents: List[str]
    keyword: str
    case_sensitive: bool = False


class KeywordSearchMatch(BaseModel):
    document: str
    index: int
    position: int


class KeywordSearchResponse(BaseModel):
    keyword: str
    matches: List[KeywordSearchMatch]
    total_matches: int
    total_documents: int


# ── Linear Search ────────────────────────────────────────────
class LinearSearchRequest(BaseModel):
    items: List[str]
    target: str


class LinearSearchStep(BaseModel):
    index: int
    item: str
    match: bool


class LinearSearchResponse(BaseModel):
    target: str
    steps: List[LinearSearchStep]
    found: bool
    found_at: Optional[int]
    comparisons: int


# ── Binary Search ────────────────────────────────────────────
class BinarySearchRequest(BaseModel):
    items: List[float]
    target: float


class BinarySearchStep(BaseModel):
    low: int
    high: int
    mid: int
    mid_value: float
    comparison: str  # "equal" | "go_left" | "go_right"


class BinarySearchResponse(BaseModel):
    target: float
    sorted_items: List[float]
    steps: List[BinarySearchStep]
    found: bool
    found_at: Optional[int]
    comparisons: int


# ── Heuristic Search (A*) ────────────────────────────────────
class HeuristicSearchRequest(BaseModel):
    start: str
    goal: str


class HeuristicSearchStep(BaseModel):
    current: str
    open_list: List[str]
    closed_list: List[str]
    f_score: float
    g_score: float
    h_score: float


class HeuristicSearchResponse(BaseModel):
    path: List[str]
    total_cost: float
    steps: List[HeuristicSearchStep]
    found: bool
    graph_nodes: List[str]


# ── Fuzzy Search ─────────────────────────────────────────────
class FuzzySearchRequest(BaseModel):
    items: List[str]
    query: str
    threshold: float = 0.4


class FuzzySearchResult(BaseModel):
    item: str
    similarity: float


class FuzzySearchResponse(BaseModel):
    query: str
    results: List[FuzzySearchResult]
    threshold: float


# ── Full-Text Search ─────────────────────────────────────────
class FullTextSearchRequest(BaseModel):
    documents: List[str]
    query: str


class FullTextSearchResult(BaseModel):
    document: str
    index: int
    score: float
    matched_terms: List[str]


class FullTextSearchResponse(BaseModel):
    query: str
    results: List[FullTextSearchResult]
    total_documents: int


# ── Faceted Search ───────────────────────────────────────────
class FacetedSearchRequest(BaseModel):
    items: List[Dict[str, Any]]
    filters: Dict[str, Any]


class FacetedSearchResponse(BaseModel):
    total_items: int
    matched_items: List[Dict[str, Any]]
    matched_count: int
    filters_applied: Dict[str, Any]
    available_facets: Dict[str, List[str]]
