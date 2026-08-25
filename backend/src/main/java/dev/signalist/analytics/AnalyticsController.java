package dev.signalist.analytics;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
class AnalyticsController {
    private final AnalyticsEventRepository events;

    AnalyticsController(AnalyticsEventRepository events) { this.events = events; }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.ACCEPTED)
    AcceptedEvent ingest(@Valid @RequestBody EventRequest request, @RequestHeader(value = "Referer", required = false) String referer) {
        var event = new AnalyticsEvent(request.siteId(), request.type(), request.path(),
                request.referrer() == null ? referer : request.referrer(),
                request.timestamp() == null ? Instant.now() : request.timestamp());
        events.save(event);
        return new AcceptedEvent(true);
    }

    @GetMapping("/sites/{siteId}/overview")
    Overview overview(@PathVariable String siteId) {
        Instant since = Instant.now().minus(30, ChronoUnit.DAYS);
        List<AnalyticsEvent> recent = events.findBySiteIdAndOccurredAtAfter(siteId, since);
        long views = recent.stream().filter(event -> event.getType().equals("pageview")).count();
        long eventsCount = recent.stream().filter(event -> event.getType().equals("event")).count();
        List<PageMetric> pages = recent.stream().filter(event -> event.getType().equals("pageview"))
                .collect(java.util.stream.Collectors.groupingBy(AnalyticsEvent::getPath, java.util.stream.Collectors.counting()))
                .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed()).limit(5)
                .map(entry -> new PageMetric(entry.getKey(), entry.getValue())).toList();
        return new Overview(views, eventsCount, pages);
    }

    record EventRequest(@NotBlank String siteId, @NotBlank String type, @NotBlank String path, String referrer, Instant timestamp) { }
    record AcceptedEvent(boolean accepted) { }
    record PageMetric(String path, long views) { }
    record Overview(long pageviews, long customEvents, List<PageMetric> topPages) { }
}
