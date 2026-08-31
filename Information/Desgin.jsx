                ┌─────────────────┐
                │     Client      │
                └────────┬────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │

    WRITE SIDE                    READ SIDE
    (COMMAND)                      (QUERY)

 POST /student                 GET /student
          │                             │
          ▼                             ▼
     Router_Post                  Router_Get
          │                             │
          ▼                             ▼
 Command Controller            Query Controller
          │                             │
          ▼                             ▼
 Command Service               Query Service
          │                             │
          ▼                             ▼
 Write Repository              Read Repository
          │                             │
          ▼                             ▼
     MongoDB Write               Redis / Read DB