from fastapi import APIRouter, HTTPException
from app.schemas.search import (
    SemanticSearchRequest, SemanticSearchResponse,
    KeywordSearchRequest, KeywordSearchResponse,
    LinearSearchRequest, LinearSearchResponse,
    BinarySearchRequest, BinarySearchResponse,
    HeuristicSearchRequest, HeuristicSearchResponse,
    FuzzySearchRequest, FuzzySearchResponse,
    FullTextSearchRequest, FullTextSearchResponse,
    FacetedSearchRequest, FacetedSearchResponse,
)
from app.services.search_service import (
    semantic_search,
    keyword_search,
    linear_search,
    binary_search,
    heuristic_search,
    fuzzy_search,
    full_text_search,
    faceted_search,
)

router = APIRouter()


@router.post("/semantic", response_model=SemanticSearchResponse)
def search_semantic(request: SemanticSearchRequest):
    sentences = [s for s in request.sentences if s.strip()]
    if not sentences:
        raise HTTPException(status_code=400, detail="Provide at least one sentence")
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    k = max(1, min(request.k, len(sentences)))
    try:
        result = semantic_search(sentences, request.query, k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {str(e)}")
    return SemanticSearchResponse(**result)


@router.post("/keyword", response_model=KeywordSearchResponse)
def search_keyword(request: KeywordSearchRequest):
    documents = [d for d in request.documents if d.strip()]
    if not documents:
        raise HTTPException(status_code=400, detail="Provide at least one document")
    if not request.keyword.strip():
        raise HTTPException(status_code=400, detail="Keyword cannot be empty")
    result = keyword_search(documents, request.keyword, request.case_sensitive)
    return KeywordSearchResponse(**result)


@router.post("/linear", response_model=LinearSearchResponse)
def search_linear(request: LinearSearchRequest):
    items = [i for i in request.items if i.strip()]
    if not items:
        raise HTTPException(status_code=400, detail="Provide at least one item")
    if not request.target.strip():
        raise HTTPException(status_code=400, detail="Target cannot be empty")
    result = linear_search(items, request.target)
    return LinearSearchResponse(**result)


@router.post("/binary", response_model=BinarySearchResponse)
def search_binary(request: BinarySearchRequest):
    if len(request.items) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 numbers")
    result = binary_search(request.items, request.target)
    return BinarySearchResponse(**result)


@router.post("/heuristic", response_model=HeuristicSearchResponse)
def search_heuristic(request: HeuristicSearchRequest):
    if not request.start.strip() or not request.goal.strip():
        raise HTTPException(status_code=400, detail="Start and goal cities cannot be empty")
    if request.start == request.goal:
        raise HTTPException(status_code=400, detail="Start and goal must be different cities")
    result = heuristic_search(request.start, request.goal)
    return HeuristicSearchResponse(**result)


@router.post("/fuzzy", response_model=FuzzySearchResponse)
def search_fuzzy(request: FuzzySearchRequest):
    items = [i for i in request.items if i.strip()]
    if not items:
        raise HTTPException(status_code=400, detail="Provide at least one item")
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    result = fuzzy_search(items, request.query, request.threshold)
    return FuzzySearchResponse(**result)


@router.post("/fulltext", response_model=FullTextSearchResponse)
def search_fulltext(request: FullTextSearchRequest):
    documents = [d for d in request.documents if d.strip()]
    if not documents:
        raise HTTPException(status_code=400, detail="Provide at least one document")
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    result = full_text_search(documents, request.query)
    return FullTextSearchResponse(**result)


@router.post("/faceted", response_model=FacetedSearchResponse)
def search_faceted(request: FacetedSearchRequest):
    if not request.items:
        raise HTTPException(status_code=400, detail="Provide at least one item")
    result = faceted_search(request.items, request.filters)
    return FacetedSearchResponse(**result)
