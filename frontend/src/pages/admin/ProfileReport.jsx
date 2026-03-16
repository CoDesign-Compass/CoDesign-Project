import React from 'react'

export default function ProfileReport() {
  /**
   * TODO (backend integration):
   * Replace this mock demo state with real request state.
   *
   * Expected mapping:
   * - 'loading': request in progress
   * - 'error': request failed
   * - 'empty': request succeeded but returned no usable report data
   * - 'success': request succeeded and returned renderable report data
   */
  const demoState = 'success'

  /**
   * TODO (backend integration):
   * Replace this mock summary data with real backend response data.
   *
   * This area is currently styled as a simple profile-summary chart block.
   * Expected frontend shape:
   * [
   *   { label: string, value: number },
   *   { label: string, value: number },
   *   ...
   * ]
   *
   * Example:
   * [
   *   { label: 'Students', value: 16 },
   *   { label: 'Staff', value: 9 },
   *   { label: 'Community members', value: 6 }
   * ]
   */
  const summaryMetrics = [
    { label: 'Students', value: 16 },
    { label: 'Staff', value: 9 },
    { label: 'Community members', value: 6 },
    { label: 'First-time participants', value: 11 },
  ]

  /**
   * This report card list is currently frontend-defined for UI/UX consistency.
   *
   * Unless report sections become dynamic in the future, backend does NOT need
   * to replace this block.
   *
   * Backend only needs to return matching detailed content for each `id`
   * inside `sectionContent`.
   */
  const reportCards = [
    {
      id: 'themes-concerns',
      title: 'Themes & Concerns',
      desc: 'Review recurring themes and profile-related concerns identified across participant responses.',
    },
    {
      id: 'demographics-participation',
      title: 'Demographics & Participation Metrics',
      desc: 'Explore participant composition and high-level engagement patterns across profile groups.',
    },
    {
      id: 'actionable-recommendations',
      title: 'Actionable Insights & Recommendations Analysis',
      desc: 'Summarise practical recommendations that can support future outreach and participation improvements.',
    },
  ]

  /**
   * TODO (backend integration):
   * Replace this mock detailed section content with real backend response data.
   *
   * Expected frontend shape:
   * {
   *   'themes-concerns': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   },
   *   'demographics-participation': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   },
   *   'actionable-recommendations': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   }
   * }
   *
   * Notes:
   * - Keys should match the frontend `reportCards[].id`.
   * - `description` is rendered as the main paragraph for each section.
   * - `points` is optional; if present, it will be rendered as a bullet list.
   */
  const sectionContent = {
    'themes-concerns': {
      title: 'Themes & Concerns',
      description:
        'This section summarises the most common themes and profile-related concerns identified across the current participant responses.',
      points: [
        'Several responses highlighted communication, accessibility, and support-related concerns.',
        'Some themes appeared more strongly in particular participant groups.',
        'Repeated concerns may indicate broader systemic issues rather than isolated cases.',
      ],
    },
    'demographics-participation': {
      title: 'Demographics & Participation Metrics',
      description:
        'This section presents a high-level view of participant composition and the relative participation patterns observed in the current report.',
      points: [
        'Participation was uneven across different profile groups.',
        'Some groups were more likely to provide detailed responses than others.',
        'Understanding profile distribution can help interpret which voices are most visible in the dataset.',
      ],
    },
    'actionable-recommendations': {
      title: 'Actionable Insights & Recommendations Analysis',
      description:
        'This section outlines practical recommendations that may improve inclusion, outreach, and future participation quality.',
      points: [
        'Target underrepresented groups with clearer outreach and participation guidance.',
        'Use profile-level patterns to improve support strategies and follow-up communication.',
        'Review repeated concerns to identify where structural improvements may be needed.',
      ],
    },
  }

  /**
   * Shared UI helper for loading / error / empty states.
   * Backend does NOT need to change this UI block.
   */
  const renderStateCard = (title, text, isError = false) => (
    <div
      style={{
        border: `1px solid ${isError ? '#f1d5db' : '#e5e7eb'}`,
        borderRadius: '20px',
        background: isError ? '#fffafb' : '#ffffff',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
        padding: '24px',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '1.125rem',
          lineHeight: 1.5,
          fontWeight: 600,
          color: '#111827',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: '10px 0 0',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          color: '#6b7280',
        }}
      >
        {text}
      </p>
    </div>
  )

  /**
   * Summary renderer.
   *
   * TODO (backend integration):
   * Once real data is available, this UI can render directly from the mapped
   * `summaryMetrics` array above without changing the card structure itself.
   *
   * Backend does NOT need to modify this rendering logic,
   * only provide data that can be mapped into the expected shape.
   */
  const renderSummaryOverview = () => {
    if (!summaryMetrics.length) {
      return (
        <div
          style={{
            minHeight: '220px',
            border: '1px dashed #d1d5db',
            borderRadius: '16px',
            background: '#f9fafb',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          <div>
            <strong>No summary data available.</strong>
            <p style={{ margin: '8px 0 0 0' }}>
              A summary visual can be shown here once profile metrics are
              available.
            </p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...summaryMetrics.map((item) => item.value), 1)

    return (
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          background: '#f9fafb',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {summaryMetrics.map((item) => {
          const widthPercent = Math.max((item.value / maxValue) * 100, 4)

          return (
            <div
              key={item.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 56px',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: '#374151',
                  wordBreak: 'break-word',
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  width: '100%',
                  height: '12px',
                  borderRadius: '999px',
                  background: '#e5e7eb',
                  overflow: 'hidden',
                }}
                aria-hidden="true"
              >
                <div
                  style={{
                    height: '100%',
                    width: `${widthPercent}%`,
                    borderRadius: '999px',
                    background: '#9ca3af',
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.4,
                  color: '#6b7280',
                  textAlign: 'right',
                }}
              >
                {item.value}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * Clickable card section.
   *
   * Backend does NOT need to replace this layout.
   * These cards currently jump to in-page anchor sections by ID.
   * If section IDs remain stable, no backend change is needed here.
   */
  const renderClickableCards = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}
    >
      {reportCards.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            minHeight: '160px',
            padding: '20px',
            boxSizing: 'border-box',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            background: '#ffffff',
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
            transition:
              'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow =
              '0 10px 24px rgba(15, 23, 42, 0.08)'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow =
              '0 6px 18px rgba(15, 23, 42, 0.04)'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '1.05rem',
                lineHeight: 1.5,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              {item.title}
            </h3>

            <span
              style={{
                flexShrink: 0,
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                background: '#f9fafb',
                padding: '4px 10px',
                fontSize: '0.75rem',
                lineHeight: 1.4,
                color: '#6b7280',
              }}
            >
              View
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            {item.desc}
          </p>
        </a>
      ))}
    </div>
  )

  /**
   * Detailed section renderer.
   *
   * TODO (backend integration):
   * Replace mock `sectionContent` with backend-returned content
   * while keeping section keys aligned with `reportCards[].id`.
   *
   * Backend only needs to provide content data.
   * This card layout and anchor structure can remain unchanged.
   */
  const renderDetailSections = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {reportCards.map((item) => {
        const detail = sectionContent[item.id]

        return (
          <article
            key={item.id}
            id={item.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
              padding: '24px',
              scrollMarginTop: '24px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '1.05rem',
                lineHeight: 1.5,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              {detail.title}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: '#6b7280',
              }}
            >
              {detail.description}
            </p>

            {Array.isArray(detail.points) && detail.points.length > 0 && (
              <ul
                style={{
                  margin: '16px 0 0 0',
                  paddingLeft: '20px',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: '#6b7280',
                }}
              >
                {detail.points.map((point, index) => (
                  <li
                    key={`${item.id}-${index}`}
                    style={{ marginTop: index === 0 ? 0 : '8px' }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </article>
        )
      })}
    </div>
  )

  /**
   * Main success-state content.
   *
   * Backend does NOT need to change the visual structure below.
   * Only the underlying data source will change in future integration.
   */
  const renderSuccessContent = () => (
    <>
      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
          padding: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              lineHeight: 1.3,
              fontWeight: 700,
              color: '#111827',
            }}
          >
            Profile Report
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            Review participant profile patterns, recurring concerns, and
            supporting insights in a consistent report layout.
          </p>
        </div>
      </section>

      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.125rem',
              lineHeight: 1.5,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Summary Overview
          </h2>

          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            This section presents a simple summary of participant profile and
            participation metrics for the current report view.
          </p>
        </div>

        {renderSummaryOverview()}
      </section>

      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.125rem',
              lineHeight: 1.5,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Featured Reports
          </h2>

          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            Open one of the report sections below to jump directly to the
            related analysis content.
          </p>
        </div>

        {renderClickableCards()}
      </section>

      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.125rem',
              lineHeight: 1.5,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Detailed Sections
          </h2>

          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            Each section below provides a more detailed explanation of the
            current profile report findings.
          </p>
        </div>

        {renderDetailSections()}
      </section>
    </>
  )

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--OnSurface, #ffffff)',
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 20px 48px',
          boxSizing: 'border-box',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {demoState === 'loading' &&
            renderStateCard(
              'Loading profile report',
              'Please wait while the report summary, cards, and section content are being prepared.',
            )}

          {demoState === 'error' &&
            renderStateCard(
              'Unable to load this report',
              'Something went wrong while preparing the report view. Please try again later.',
              true,
            )}

          {demoState === 'empty' &&
            renderStateCard(
              'No report data available yet',
              'This report page is ready, but there is currently no content available to display.',
            )}

          {demoState === 'success' && renderSuccessContent()}
        </section>
      </main>
    </div>
  )
}
