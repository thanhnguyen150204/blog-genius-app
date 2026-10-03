import { useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { Page, BlockStack, Grid } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import dashboardStyles from "../styles/dashboard.css?url";
import "../styles/dashboard.css";
import {
  CreditsBar,
  RatingFeedbackCard,
  DashboardHeader,
  MetricScorecards,
  ContentByIntentCard,
  RecentPostsCard,
  GeoTechnicalHealthCard,
  CreatePostCallout,
  ContentCalendar,
  AppEmbedsFooter,
  FreshnessModal,
  AiCitationsModal,
} from "../components/dashboard";

export const links = () => [{ rel: "stylesheet", href: dashboardStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const shouldRevalidate = () => false;

export default function DashboardRoute() {
  const [geoHealthScore, setGeoHealthScore] = useState(60);
  const [missingFaqCount, setMissingFaqCount] = useState(1);
  const [missingSummaryCount, setMissingSummaryCount] = useState(1);
  const [calendarStatus, setCalendarStatus] = useState("All");
  const [calendarView, setCalendarView] = useState("Month");
  const [showRatingBanner, setShowRatingBanner] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showFreshnessModal, setShowFreshnessModal] = useState(false);
  const [showAiCitationsModal, setShowAiCitationsModal] = useState(false);

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
    },
  ]);

  const handleFixChecklist = (type) => {
    if (type === "faq") {
      setMissingFaqCount(0);
      setGeoHealthScore((prev) => Math.min(100, prev + 20));
      setPosts((prev) =>
        prev.map((p) => ({ ...p, hasFaqSchema: true, geoScore: Math.min(100, p.geoScore + 20) })),
      );
    } else if (type === "summary") {
      setMissingSummaryCount(0);
      setGeoHealthScore((prev) => Math.min(100, prev + 20));
      setPosts((prev) =>
        prev.map((p) => ({ ...p, hasAnswerBlock: true, geoScore: Math.min(100, p.geoScore + 20) })),
      );
    }
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

          <Grid>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
                <ContentByIntentCard
                  totalPosts={posts.length}
                  informationalCount={posts.filter((p) => p.intent === "Informational").length}
                  buyersGuideCount={posts.filter((p) => p.intent === "Buyer's guide").length}
                  faqCount={posts.filter((p) => p.intent === "FAQ").length}
                  howToCount={posts.filter((p) => p.intent === "How-to").length}
                  companyFactsCount={posts.filter((p) => p.intent === "Company Facts").length}
                  aboutCount={posts.filter((p) => p.intent === "About").length}
                />
                <RecentPostsCard posts={posts} />
              </div>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
              <div style={{ height: "100%" }}>
                <GeoTechnicalHealthCard
                  missingFaqCount={missingFaqCount}
                  missingSummaryCount={missingSummaryCount}
                  onFixChecklist={handleFixChecklist}
                  onOpenFreshness={() => setShowFreshnessModal(true)}
                />
              </div>
            </Grid.Cell>
          </Grid>

          <CreatePostCallout />

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

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
