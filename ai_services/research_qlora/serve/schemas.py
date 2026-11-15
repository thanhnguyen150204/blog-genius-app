"""
Pydantic Schemas for AI Research & Content Brief Service.
Compliant with Project Plan Module 1 (SEO & GEO specifications).
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class SearchIntent(str, Enum):
    INFORMATIONAL = "Informational"
    COMMERCIAL = "Commercial"
    TRANSACTIONAL = "Transactional"
    NAVIGATIONAL = "Navigational"


class FunnelStage(str, Enum):
    TOFU = "TOFU"
    MOFU = "MOFU"
    BOFU = "BOFU"


class CompetitionLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class KeywordItem(BaseModel):
    keyword: str = Field(..., description="The keyword phrase")
    intent: SearchIntent = Field(default=SearchIntent.INFORMATIONAL, description="Search intent classification")
    search_volume: Optional[int] = Field(default=1200, description="Estimated monthly search volume")
    competition_level: Optional[CompetitionLevel] = Field(default=CompetitionLevel.MEDIUM, description="Competition level")
    cpc: Optional[float] = Field(default=0.75, description="Estimated cost per click in USD")


class KeywordResearchRequest(BaseModel):
    niche: str = Field(..., description="Industry niche or topic (e.g., 'Fitness & Supplements', 'Công nghệ AI')")
    seed_keyword: Optional[str] = Field(None, description="Optional seed keyword to anchor recommendations")
    language: str = Field("vi", description="Language code: 'vi' or 'en'")
    count: int = Field(10, description="Number of keyword suggestions to return")


class KeywordResearchResponse(BaseModel):
    keywords: List[KeywordItem] = Field(..., description="List of generated keywords with intent and metrics")
    niche: str = Field(..., description="The analyzed niche")
    source: str = Field("qlora", description="Inference source: 'qlora', 'gemini', or 'deterministic'")


class GeoBlueprint(BaseModel):
    answer_block_focus: str = Field(..., description="Direct concise summary focus (40-80 words) for AI Overviews")
    comparison_table_idea: str = Field(..., description="Comparison matrix or table idea for structured extraction")
    faq_questions: List[str] = Field(default_factory=list, description="2-4 user questions for FAQ Schema markup")


class ContentBriefRequest(BaseModel):
    primary_keyword: str = Field(..., description="Primary seed keyword")
    niche: Optional[str] = Field(None, description="Niche context (optional)")
    known_intent: Optional[str] = Field(None, description="Pre-classified search intent if available")
    language: str = Field("vi", description="Language code: 'vi' or 'en'")


class ContentBriefResponse(BaseModel):
    primary_keyword: str = Field(..., description="Primary focus keyword")
    secondary_keywords: List[str] = Field(default_factory=list, description="3-5 semantic secondary keywords")
    dominant_intent: str = Field(..., description="Primary search intent (Informational, Commercial, Transactional, Navigational)")
    funnel_stage: str = Field(..., description="Marketing funnel stage (TOFU, MOFU, BOFU)")
    recommended_content_type: str = Field(..., description="e.g. How-to Guide, Buyer's Guide, Listicle, Review")
    recommended_style: str = Field(..., description="Writing style recommendation")
    recommended_tone: str = Field(..., description="Tone of voice (e.g. Authoritative, Friendly, Informative)")
    target_audience: str = Field(..., description="Target reader persona description")
    key_talking_points: List[str] = Field(default_factory=list, description="3-5 E-E-A-T backed talking points with data/sources")
    geo_blueprint: GeoBlueprint = Field(..., description="Generative Engine Optimization blueprint")
    suggested_cta: str = Field(..., description="Actionable Call-to-Action for conversion")
    target_word_count: Optional[int] = Field(1800, description="Recommended target article length")
    source: str = Field("qlora", description="Inference source: 'qlora', 'gemini', or 'deterministic'")


class HealthResponse(BaseModel):
    status: str = "ok"
    model_loaded: bool = False
    device: str = "cpu"
    adapter_path: str = ""
    lora_enabled: bool = False
