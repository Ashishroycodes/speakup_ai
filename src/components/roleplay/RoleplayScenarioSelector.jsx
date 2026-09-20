import React, { useState, useMemo } from 'react';
import { 
  ROLEPLAY_CATEGORIES, 
  ROLEPLAY_SCENARIOS 
} from '../../data/roleplayData';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  History, 
  Layers,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Handshake,
  UserCheck,
  Users,
  Headphones,
  Mic,
  MessagesSquare,
  X
} from 'lucide-react';

// Icon mapper for categories
const CATEGORY_ICONS = {
  college: GraduationCap,
  workplace: Briefcase,
  professional: Handshake,
  interview: UserCheck,
  social: Users,
  customer_service: Headphones,
  presentation: Mic,
  group_discussion: MessagesSquare
};

export default function RoleplayScenarioSelector({
  onSelectScenario,
  onOpenHistory,
  historyCount = 0
}) {
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Track expanded state for each category box.
  // By default, first 2 categories are expanded for a quick useful preview, others can be toggled.
  const [expandedCategories, setExpandedCategories] = useState(() => ({
    college: true,
    workplace: true,
    professional: false,
    interview: false,
    social: false,
    customer_service: false,
    presentation: false,
    group_discussion: false
  }));

  // Toggle single category box
  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand all or collapse all
  const handleExpandAll = () => {
    const allExpanded = {};
    ROLEPLAY_CATEGORIES.forEach((cat) => {
      allExpanded[cat.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const handleCollapseAll = () => {
    const allCollapsed = {};
    ROLEPLAY_CATEGORIES.forEach((cat) => {
      allCollapsed[cat.id] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  const areAllExpanded = useMemo(() => {
    return ROLEPLAY_CATEGORIES.every((cat) => expandedCategories[cat.id]);
  }, [expandedCategories]);

  // Group and filter scenarios by category
  const categorizedData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ROLEPLAY_CATEGORIES.map((cat) => {
      const categoryScenarios = ROLEPLAY_SCENARIOS.filter((item) => {
        if (item.categoryId !== cat.id) return false;

        // Difficulty filter
        if (difficultyFilter !== 'all' && item.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
          return false;
        }

        // Search query
        if (query) {
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesCharacter = item.character.toLowerCase().includes(query);
          const matchesDesc = item.summary.toLowerCase().includes(query);
          const matchesRole = (item.characterRole || '').toLowerCase().includes(query);
          if (!matchesTitle && !matchesCharacter && !matchesDesc && !matchesRole) {
            return false;
          }
        }

        return true;
      });

      return {
        category: cat,
        scenarios: categoryScenarios,
        totalCount: ROLEPLAY_SCENARIOS.filter((s) => s.categoryId === cat.id).length
      };
    });
  }, [difficultyFilter, searchQuery]);

  // Total matching scenarios across all categories
  const totalMatchingScenarios = useMemo(() => {
    return categorizedData.reduce((acc, curr) => acc + curr.scenarios.length, 0);
  }, [categorizedData]);

  // Visible categories based on activeCategoryId filter
  const visibleCategories = useMemo(() => {
    if (activeCategoryId === 'all') {
      // When searching, hide categories that have 0 matches
      if (searchQuery.trim() || difficultyFilter !== 'all') {
        return categorizedData.filter((item) => item.scenarios.length > 0);
      }
      return categorizedData;
    }
    return categorizedData.filter((item) => item.category.id === activeCategoryId);
  }, [activeCategoryId, categorizedData, searchQuery, difficultyFilter]);

  return (
    <div className="roleplay-selector-container">
      {/* 1. Minimal Search & Filter Bar */}
      <div className="roleplay-filter-bar">
        <div className="roleplay-search-box">
          <Search className="roleplay-search-icon" size={18} />
          <input
            type="text"
            className="roleplay-search-input"
            placeholder="Search scenarios or characters (e.g. Professor, Salary, Team, Complaint)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="roleplay-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="roleplay-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Difficulty Selector Pills */}
        <div className="roleplay-difficulty-chips">
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`setup-chip ${difficultyFilter === lvl ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(lvl)}
              id={`filter-diff-${lvl}`}
            >
              {lvl === 'all' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>

        {/* History Action Button */}
        {historyCount > 0 && (
          <button
            type="button"
            className="roleplay-history-btn"
            onClick={onOpenHistory}
            id="open-roleplay-history-btn"
          >
            <History size={16} />
            <span>Past Sessions ({historyCount})</span>
          </button>
        )}
      </div>

      {/* 2. Category Navigation Bar (Pills with Counts) */}
      <div className="roleplay-category-pills-bar">
        <button
          type="button"
          className={`roleplay-nav-pill ${activeCategoryId === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategoryId('all')}
          id="nav-pill-all"
        >
          <span>🌐 All Categories</span>
          <span className="pill-count">{ROLEPLAY_SCENARIOS.length}</span>
        </button>

        {ROLEPLAY_CATEGORIES.map((cat) => {
          const matchingCount = categorizedData.find((c) => c.category.id === cat.id)?.scenarios.length ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              className={`roleplay-nav-pill ${activeCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategoryId(cat.id);
                // Ensure this category is open when clicked
                setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
              }}
              id={`nav-pill-${cat.id}`}
            >
              <span>{cat.badge}</span>
              <span className="pill-count">{matchingCount}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Status & Controls Bar */}
      <div className="roleplay-status-row">
        <div className="roleplay-summary-text">
          <span>
            Showing <strong>{totalMatchingScenarios}</strong> scenarios across{' '}
            <strong>{visibleCategories.length}</strong> {visibleCategories.length === 1 ? 'category' : 'categories'}
          </span>
          {activeCategoryId !== 'all' && (
            <button
              type="button"
              className="roleplay-reset-cat-btn"
              onClick={() => setActiveCategoryId('all')}
            >
              Show all categories
            </button>
          )}
        </div>

        {activeCategoryId === 'all' && visibleCategories.length > 1 && (
          <button
            type="button"
            className="roleplay-toggle-all-btn"
            onClick={areAllExpanded ? handleCollapseAll : handleExpandAll}
            id="toggle-all-categories-btn"
          >
            {areAllExpanded ? (
              <>
                <ChevronUp size={15} />
                <span>Collapse All Boxes</span>
              </>
            ) : (
              <>
                <ChevronDown size={15} />
                <span>Expand All Boxes</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 4. Category Boxes with Scenarios Inside */}
      {visibleCategories.length === 0 ? (
        <div className="roleplay-empty-state">
          <Layers size={38} className="empty-icon" />
          <h3 className="empty-title">No scenarios found</h3>
          <p className="empty-desc">
            No roleplay scenarios match your current search "{searchQuery}" or selected filters.
          </p>
          <button
            type="button"
            className="roleplay-clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setDifficultyFilter('all');
              setActiveCategoryId('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="roleplay-category-boxes-container">
          {visibleCategories.map(({ category: cat, scenarios, totalCount }) => {
            const IconComp = CATEGORY_ICONS[cat.id] || Sparkles;
            // If user searched, auto-expand matching categories
            const isExpanded = searchQuery.trim() || difficultyFilter !== 'all' 
              ? true 
              : !!expandedCategories[cat.id];

            return (
              <div 
                key={cat.id} 
                className={`roleplay-category-box category-accent-${cat.id} ${isExpanded ? 'expanded' : 'collapsed'}`}
                id={`category-box-${cat.id}`}
              >
                {/* Category Box Header */}
                <div 
                  className="roleplay-category-box-header"
                  onClick={() => toggleCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCategory(cat.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="category-header-main">
                    <div 
                      className="category-icon-wrapper"
                      style={{ background: `${cat.color}20`, color: cat.color }}
                    >
                      <IconComp size={22} />
                    </div>

                    <div className="category-info-wrap">
                      <div className="category-title-row">
                        <h3 className="category-box-title">{cat.badge}</h3>
                        <span className="category-scenarios-badge">
                          {scenarios.length} {scenarios.length === 1 ? 'Scenario' : 'Scenarios'}
                          {scenarios.length !== totalCount && ` of ${totalCount}`}
                        </span>
                      </div>
                      <p className="category-box-desc">{cat.description}</p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="category-header-actions">
                    <button
                      type="button"
                      className="category-box-toggle-btn"
                      aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                      tabIndex={-1}
                    >
                      <span>{isExpanded ? 'Hide' : 'Explore'}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Scenarios Inside This Category Box */}
                {isExpanded && (
                  <div className="roleplay-category-box-content">
                    {scenarios.length === 0 ? (
                      <p className="category-no-scenarios">
                        No scenarios in this category match the current filters.
                      </p>
                    ) : (
                      <div className="roleplay-scenarios-compact-grid">
                        {scenarios.map((item) => (
                          <div 
                            key={item.id} 
                            className="roleplay-scenario-card"
                            id={`scenario-card-${item.id}`}
                          >
                            <div className="scenario-card-body">
                              <div className="scenario-card-header">
                                <span className="scenario-character-pill">
                                  <span className="scenario-avatar">{item.characterAvatar}</span>
                                  <span className="scenario-char-name">{item.character}</span>
                                </span>

                                <span className={`scenario-difficulty-tag difficulty-${item.difficulty.toLowerCase()}`}>
                                  {item.difficulty}
                                </span>
                              </div>

                              <h4 className="scenario-card-title">{item.title}</h4>
                              <p className="scenario-card-desc">{item.summary}</p>
                            </div>

                            <div className="scenario-card-footer">
                              <span className="scenario-role-hint" title={item.characterRole}>
                                Role: {item.characterRole}
                              </span>

                              <button
                                type="button"
                                className="scenario-start-btn"
                                onClick={() => onSelectScenario(item)}
                                id={`start-scenario-btn-${item.id}`}
                              >
                                <Sparkles size={14} />
                                <span>Practice</span>
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
