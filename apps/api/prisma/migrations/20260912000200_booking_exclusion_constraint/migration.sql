ALTER TABLE "Booking"
    ALTER COLUMN "startsAt" TYPE TIMESTAMPTZ(3) USING "startsAt" AT TIME ZONE 'UTC',
    ALTER COLUMN "endsAt"   TYPE TIMESTAMPTZ(3) USING "endsAt" AT TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
    ADD CONSTRAINT "booking_no_overlap"
    EXCLUDE USING gist (
        "staffId" WITH =,
        tstzrange("startsAt", "endsAt") WITH &&
    )
    WHERE ("status" <> 'CANCELLED');