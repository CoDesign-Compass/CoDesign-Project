import React from 'react'

export default function EngagementReport() {
  /**
   * TODO (backend integration):
   * Replace this mock demo state with real request state.
   *
   * Expected mapping:
   * - 'loading': request in progress
   * - 'error': request failed
   * - 'empty': request succeeded but returned no usable report data
   * - 'success': request succeeded and returned renderable report data
   *
   * Suggested future replacement:
   * const [loading, setLoading] = useState(true)
   * const [error, setError] = useState('')
   * const [data, setData] = useState(null)
   */
  const demoState = 'success'

  /**
   * TODO (backend integration):
   * Replace this mock summary chart data with real backend response data.
   *
   * Expected frontend shape:
   * [
   *   { label: string, value: number },
   *   { label: string, value: number },
   *   ...
   * ]
   *
   * Example:
   * [
   *   { label: 'High engagement', value: 18 },
   *   { label: 'Moderate engagement', value: 11 },
   *   { label: 'Low engagement', value: 5 }
   * ]
   *
   * Notes:
   * - `label` is shown on the left side of the chart.
   * - `value` is rendered as the bar width and displayed numerically.
   * - If backend field names differ, map them into this structure before rendering.
   */
  const chartData = [
    { label: 'High engagement', value: 18 },
    { label: 'Moderate engagement', value: 11 },
    { label: 'Low engagement', value: 5 },
  ]

  /**
   * This report card list is currently frontend-defined for UI/UX consistency.
   *
   * Unless report sections become dynamic in the future, backend does NOT need
   * to replace this block.
   *
   * Backend only needs to return the matching detailed content for each `id`
   * inside `sectionContent`.
   */
  const reportCards = [
    {
      id: 'engagement-quality',
      title: 'Engagement & Response Quality Analysis',
      desc: 'Review the overall engagement pattern and the quality of responses in a clearer summary view.',
    },
    {
      id: 'feedback-summary',
      title: 'User Feedback Summary',
      desc: 'Browse the most common feedback signals, recurring concerns, and notable response tendencies.',
    },
    {
      id: 'actionable-insights',
      title: 'Actionable Insights',
      desc: 'Identify practical recommendations and follow-up directions based on the current report findings.',
    },
  ]

  /**
   * TODO (backend integration):
   * Replace this mock detailed section content with real backend response data.
   *
   * Expected frontend shape:
   * {
   *   'engagement-quality': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   },
   *   'feedback-summary': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   },
   *   'actionable-insights': {
   *     title: string,
   *     description: string,
   *     points?: string[]
   *   }
   * }
   *
   * Notes:
   * - Keys should match the frontend `reportCards[].id`.
   * - `title` can be returned by backend or kept aligned with frontend card titles.
   * - `description` is rendered as the main paragraph for the section.
   * - `points` is optional; if present, it will be rendered as a bullet list.
   */
  const sectionContent = {
    'engagement-quality': {
      title: 'Engagement & Response Quality Analysis',
      description:
        'This section summarises the overall engagement level and highlights the general quality of responses observed in the current report.',
      points: [
        'Most responses showed meaningful engagement with the prompt.',
        'A smaller portion of answers appeared brief or less specific.',
        'Response quality was stronger when users referred to concrete examples or direct experiences.',
      ],
    },
    'feedback-summary': {
      title: 'User Feedback Summary',
      description:
        'This section presents a concise summary of the main feedback patterns identified across user responses.',
      points: [
        'Users frequently focused on clarity, usability, and communication-related issues.',
        'Several responses repeated similar themes, indicating recurring concerns.',
        'Feedback was more actionable when users described both the issue and its impact.',
      ],
    },
    'actionable-insights': {
      title: 'Actionable Insights',
      description:
        'This section highlights practical insights that may support follow-up action and future design or service improvements.',
      points: [
        'Improve guidance around key user steps where confusion is commonly reported.',
        'Prioritise recurring concerns that appear across multiple responses.',
        'Use clearer prompts or support materials to encourage more specific answers.',
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
   * Summary chart renderer.
   *
   * TODO (backend integration):
   * Once real data is available, this UI can render directly from the mapped
   * `chartData` array above without changing the chart structure itself.
   *
   * Backend does NOT need to modify this rendering logic,
   * only provide data that can be mapped into the expected shape.
   */
  const renderSummaryChart = () => {
    if (!chartData.length) {
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
              A chart can be shown here once report metrics are available.
            </p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...chartData.map((item) => item.value), 1)

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
        {chartData.map((item) => {
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
            Engagement Report
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            Review engagement findings, response quality indicators, and
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
            This chart presents a simple summary of engagement-related metrics
            for the current report view.
          </p>
        </div>

        {renderSummaryChart()}
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
            current engagement report findings.
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
              'Loading engagement report',
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
