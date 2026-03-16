import React from 'react'

export default function WhyReport() {
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
   * This area is currently styled as a simple word-frequency style summary block.
   * Expected frontend shape:
   * [
   *   { label: string, value: number },
   *   { label: string, value: number },
   *   ...
   * ]
   *
   * Example:
   * [
   *   { label: 'communication', value: 18 },
   *   { label: 'support', value: 14 },
   *   { label: 'timing', value: 9 }
   * ]
   */
  const summaryTerms = [
    { label: 'communication', value: 18 },
    { label: 'support', value: 14 },
    { label: 'timing', value: 11 },
    { label: 'clarity', value: 9 },
    { label: 'feedback', value: 7 },
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
      desc: 'Review recurring themes and common concerns identified from user responses.',
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis',
      desc: 'Explore the overall emotional tone and response patterns reflected in user answers.',
    },
    {
      id: 'actionable-recommendations',
      title: 'Actionable Insights & Recommendations Analysis',
      desc: 'Summarise practical insights and recommendations that can support future action.',
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
   *   'sentiment-analysis': {
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
        'This section summarises the most common themes and concerns identified across the current set of user responses.',
      points: [
        'Several responses focused on communication and clarity-related issues.',
        'Repeated concerns suggest that some problems are experienced consistently by multiple users.',
        'Themes become easier to interpret when grouped by impact, frequency, or context.',
      ],
    },
    'sentiment-analysis': {
      title: 'Sentiment Analysis',
      description:
        'This section presents the general emotional tone observed in the responses and highlights whether user sentiment appears more positive, mixed, or negative.',
      points: [
        'A large portion of responses reflected concern or frustration about the reported issue.',
        'Some responses remained neutral and focused on describing events rather than emotions.',
        'Clearer and more detailed responses often provided stronger emotional signals.',
      ],
    },
    'actionable-recommendations': {
      title: 'Actionable Insights & Recommendations Analysis',
      description:
        'This section outlines practical insights and recommendations that may help improve future follow-up, communication, or support actions.',
      points: [
        'Prioritise recurring concerns that appear across multiple user responses.',
        'Provide more explicit guidance or clearer information where confusion is common.',
        'Use the identified themes to support more targeted follow-up actions.',
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
   * `summaryTerms` array above without changing the card structure itself.
   *
   * Backend does NOT need to modify this rendering logic,
   * only provide data that can be mapped into the expected shape.
   */
  const renderSummaryOverview = () => {
    if (!summaryTerms.length) {
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
              A summary visual can be shown here once term or theme data is
              available.
            </p>
          </div>
        </div>
      )
    }

    const maxValue = Math.max(...summaryTerms.map((item) => item.value), 1)

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
        {summaryTerms.map((item) => {
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
            Why Report
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#6b7280',
            }}
          >
            Review how users responded, identify recurring patterns, and explore
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
            This section presents a simple summary of the most frequent terms or
            recurring themes appearing in user answers.
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
            current report findings.
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
              'Loading how report',
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
