package dev.signalist.analytics;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "analytics_events")
class AnalyticsEvent {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false) private String siteId;
    @Column(nullable = false) private String type;
    @Column(nullable = false) private String path;
    private String referrer;
    @Column(nullable = false) private Instant occurredAt;

    protected AnalyticsEvent() { }

    AnalyticsEvent(String siteId, String type, String path, String referrer, Instant occurredAt) {
        this.siteId = siteId;
        this.type = type;
        this.path = path;
        this.referrer = referrer;
        this.occurredAt = occurredAt;
    }

    String getSiteId() { return siteId; }
    String getType() { return type; }
    String getPath() { return path; }
    String getReferrer() { return referrer; }
    Instant getOccurredAt() { return occurredAt; }
}
