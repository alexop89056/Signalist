package dev.signalist.analytics;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, String> {
    long countBySiteIdAndTypeAndOccurredAtAfter(String siteId, String type, Instant after);
    List<AnalyticsEvent> findBySiteIdAndOccurredAtAfter(String siteId, Instant after);
}
