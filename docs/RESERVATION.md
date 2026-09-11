# Reservation page

Route: /reserveren. Reuses Hero, Header/book navigation, ReviewsSection and Footer. No fan or video. The reservation route loads its form and calendar libraries on demand so other pages do not download them initially.

Hero: supplied reserveer-hero.HEIC, EXIF-oriented and resized without upscaling to WebP widths 960/1920/2560 at quality 83.

Form: @formspree/react useForm('mqpkjgdv'). Contact detection accepts email or common international phone punctuation; original contact plus detected contact_type and only the matching email/phone field are sent. Also sends trimmed name/message, arrival_date, departure_date (YYYY-MM-DD), stay_length_days. No private secrets.

Calendar: react-day-picker, localized NL/FR/EN. Local year/month/day are mapped to UTC day indices for DST-independent calendar-day differences. Only Sundays are selectable for arrival and departure. Past arrivals and departures before the following Sunday are disabled. Submission independently enforces Sunday endpoints and at least 7 calendar days; multiple full weeks are supported. The intro, calendar help and validation errors explain this in NL/FR/EN. Range can be cleared or replaced. Escape closes and restores focus. Errors are localized; raw server detail is not displayed.

Validation: tests/reservation.spec.ts covers six viewports, all requested contact examples, Sunday-only endpoints, one/two-week stays, invalid weekdays, same-day/missing/past dates, DST, keyboard selection and range editing, calendar fit, required fields, successful email payload and failed phone payload, submitting/success/error states, localized months, menu order and active state. All Formspree requests are intercepted: no live enquiry was sent and actual inbox delivery has not been tested.

The hero RELI button uses the supplied logo, #8B82EF and the supplied le-reflet-du-lac URL. WhatsApp icon/text links and the form intro mention have been removed globally. Reviews have 6vw spacing before the footer (64px tablet, 48px mobile).

Both supplied RELI logos are optically lowered by 6% of their displayed height using CSS transforms; SVG source, scale, button dimensions, colour and links are unchanged. Verified in desktop, tablet and mobile screenshots.
