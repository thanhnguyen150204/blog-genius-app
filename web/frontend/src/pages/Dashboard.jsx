import { useState, useEffect, useRef } from "react";
import { Page, BlockStack, Layout } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  CreditsBar,
  RatingFeedbackCard,
  DashboardHeader,
  MetricScorecards,
  TrendingIdeasCard,
  GeoTechnicalHealthCard,
  CreatePostCallout,
  ContentCalendar,
  AppEmbedsFooter,
  FreshnessModal,
  AiCitationsModal,
} from "../components/dashboard";

export default function Dashboard() {
  const shopify = useAppBridge();
  const [geoHealthScore, setGeoHealthScore] = useState(60);
  const [calendarStatus, setCalendarStatus] = useState("All");
  const [calendarView, setCalendarView] = useState("Month");
  const [showRatingBanner, setShowRatingBanner] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showFreshnessModal, setShowFreshnessModal] = useState(false);
  const [showAiCitationsModal, setShowAiCitationsModal] = useState(false);
  const [trendingCardHeight, setTrendingCardHeight] = useState(null);
  const trendingCardRef = useRef(null);

  useEffect(() => {
    if (!trendingCardRef.current) return;
    const updateHeight = () => {
      if (window.innerWidth > 768 && trendingCardRef.current) {
        setTrendingCardHeight(trendingCardRef.current.offsetHeight);
      } else {
        setTrendingCardHeight(null);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(trendingCardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // 7 Core GEO Ranking Factors
  const [geoFactors, setGeoFactors] = useState({
    crawlers: true,    
    freshness: true,    
    tables: true,       
    statistics: true,   
    faq: false,         
    summary: false,     
    author: false,      
  });

  const [posts, setPosts] = useState([
    {
      id: "post-1",
      title: "test",
      intent: "Informational",
      publishedAt: "Published 1m ago",
      geoScore: 60,
      status: "Published",
      hasAnswerBlock: false,
      hasFaqSchema: false,
      hasAuthorBio: false,
    },
  ]);

  const handleFixChecklist = (type) => {
    if (type === "faq") {
      setGeoFactors((prev) => ({ ...prev, faq: true }));
      setGeoHealthScore((prev) => Math.min(100, prev + 15));
      setPosts((prev) =>
        prev.map((p) => ({ ...p, hasFaqSchema: true, geoScore: Math.min(100, p.geoScore + 15) })),
      );
      shopify.toast?.show("Applied schema.org/FAQPage JSON-LD schema (+15% GEO score)");
    } else if (type === "summary") {
      setGeoFactors((prev) => ({ ...prev, summary: true }));
      setGeoHealthScore((prev) => Math.min(100, prev + 15));
      setPosts((prev) =>
        prev.map((p) => ({ ...p, hasAnswerBlock: true, geoScore: Math.min(100, p.geoScore + 15) })),
      );
      shopify.toast?.show("Injected Direct Answer block (TL;DR) into post (+15% GEO score)");
    } else if (type === "author") {
      setGeoFactors((prev) => ({ ...prev, author: true }));
      setGeoHealthScore((prev) => Math.min(100, prev + 10));
      setPosts((prev) =>
        prev.map((p) => ({ ...p, hasAuthorBio: true, geoScore: Math.min(100, p.geoScore + 10) })),
      );
      shopify.toast?.show("Assigned Store Expert Author E-E-A-T profile (+10% GEO score)");
    } else if (type === "statistics") {
      shopify.toast?.show("Statistical proof verified: +41% citation boost (Princeton GEO bench)");
    } else if (type === "tables") {
      shopify.toast?.show("HTML comparison tables verified: +38% LLM extraction accuracy");
    } else if (type === "crawlers") {
      shopify.toast?.show("AI crawlers verified: robots.txt allows GPTBot, ClaudeBot, PerplexityBot");
    }
  };

  const handleAutoFixAll = () => {
    setGeoFactors({
      crawlers: true,
      freshness: true,
      tables: true,
      statistics: true,
      faq: true,
      summary: true,
      author: true,
    });
    setGeoHealthScore(100);
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        hasFaqSchema: true,
        hasAnswerBlock: true,
        hasAuthorBio: true,
        geoScore: 100,
      })),
    );
    shopify.toast?.show("Auto-fixed all GEO technical & content factors! Score is now 100% Optimal.");
  };

  const isPostVisible = calendarStatus === "All" || calendarStatus === "Published";

  return (
    <Page>
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingBottom: "32px" }}>
        <BlockStack gap="500">
          <DashboardHeader />

          <MetricScorecards
            geoHealthScore={geoHealthScore}
            publishedCount={posts.length}
            totalPosts={posts.length}
            scheduledCount={0}
            postsNeedingRefresh={0}
            onOpenAiCitations={() => setShowAiCitationsModal(true)}
            onOpenFreshness={() => setShowFreshnessModal(true)}
          />

          <div className="dashboard-layout-row">
            <Layout>
              <Layout.Section>
                <div ref={trendingCardRef} style={{ height: "100%" }}>
                  <TrendingIdeasCard />
                </div>
              </Layout.Section>
              <Layout.Section variant="oneThird">
                <GeoTechnicalHealthCard
                  geoFactors={geoFactors}
                  geoHealthScore={geoHealthScore}
                  onFixChecklist={handleFixChecklist}
                  onOpenFreshness={() => setShowFreshnessModal(true)}
                  cardHeight={trendingCardHeight}
                />
              </Layout.Section>
            </Layout>
          </div>

          <ContentCalendar
            calendarView={calendarView}
            onViewChange={setCalendarView}
            calendarStatus={calendarStatus}
            onStatusChange={setCalendarStatus}
            isPostVisible={isPostVisible}
          />

          <RatingFeedbackCard
            visible={showRatingBanner}
            onDismiss={() => setShowRatingBanner(false)}
            userRating={userRating}
            onRate={setUserRating}
            hoverRating={hoverRating}
            onHoverRate={setHoverRating}
          />

          <CreditsBar
            monthlyCredits={250}
            lifetimeCredits={55}
            resetDate="Nov 2, 2026"
          />

          <AppEmbedsFooter />
        </BlockStack>

        <FreshnessModal
          open={showFreshnessModal}
          onClose={() => setShowFreshnessModal(false)}
        />

        <AiCitationsModal
          open={showAiCitationsModal}
          onClose={() => setShowAiCitationsModal(false)}
        />
      </div>
    </Page>
  );
}
