import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, 
  Flame, 
  BookOpen, 
  PlusCircle, 
  Search, 
  Trash2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Sparkles,
  Calendar,
  BarChart3
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './TeacherDashboard.css';

const getDefaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [kpis, setKpis] = useState({
    totalStudents: 0,
    activeThisWeek: 0,
    avgScore: 0,
    totalAssignments: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'active' | 'needs_practice' | 'top_scorers'

  // New Assignment Modal / Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    skill_category: 'Speaking',
    target_score: 75,
    due_date: getDefaultDueDate()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected student for detail view
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentsRes, assignmentsRes] = await Promise.all([
        authService.getTeacherStudents(),
        authService.getTeacherAssignments()
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.students || []);
        if (studentsRes.kpis) {
          setKpis(studentsRes.kpis);
        }
      } else {
        setError(studentsRes.message);
      }

      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.assignments || []);
      }
    } catch {
      setError('Failed to fetch class metrics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.title.trim()) return;

    setIsSubmitting(true);
    const res = await authService.createAssignment(assignmentForm);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Assignment published to students!');
      setShowCreateModal(false);
      setAssignmentForm({
        title: '',
        description: '',
        skill_category: 'Speaking',
        target_score: 75,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setError(res.message || 'Failed to create assignment');
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    const res = await authService.deleteAssignment(id);
    if (res.success) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      setSuccessMsg('Assignment removed.');
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.course && student.course.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'active') {
        return (student.streak || 0) > 0;
      }
      if (filterType === 'needs_practice') {
        return (student.overall_score || 0) < 70;
      }
      if (filterType === 'top_scorers') {
        return (student.overall_score || 0) >= 80;
      }

      return true;
    });
  }, [students, searchTerm, filterType]);

  return (
    <div className="teacher-dashboard">
      <div className="teacher-container">
        {/* Top Header Banner */}
        <div className="teacher-header">
          <div className="teacher-header-copy">
            <div className="teacher-badge-pill">
              <GraduationCap size={16} className="text-indigo-400" />
              <span>Educator Portal</span>
            </div>
            <h1 className="teacher-title">
              Welcome back, {user?.name || 'Professor'} 👋
            </h1>
            <p className="teacher-subtitle">
              Monitor student engagement, track fluency milestones, and curate tailored communication assignments.
            </p>
          </div>

          <div className="teacher-header-actions">
            <button 
              className="btn btn-primary btn-create-assignment"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle size={18} />
              <span>New Assignment</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="teacher-alert success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="teacher-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Metrics Cards */}
        <div className="teacher-kpi-grid">
          <div className="teacher-kpi-card">
            <div className="teacher-kpi-icon-wrap indigo">
              <Users size={22} />
            </div>
            <div className="teacher-kpi-content">
              <span className="teacher-kpi-label">Enrolled Students</span>
              <h2 className="teacher-kpi-val">{kpis.totalStudents || students.length}</h2>
            </div>
          </div>

          <div className="teacher-kpi-card">
            <div className="teacher-kpi-icon-wrap emerald">
              <Clock size={22} />
            </div>
            <div className="teacher-kpi-content">
              <span className="teacher-kpi-label">Active This Week</span>
              <h2 className="teacher-kpi-val">{kpis.activeThisWeek || students.length}</h2>
            </div>
          </div>

          <div className="teacher-kpi-card">
            <div className="teacher-kpi-icon-wrap amber">
              <TrendingUp size={22} />
            </div>
            <div className="teacher-kpi-content">
              <span className="teacher-kpi-label">Class Avg. Fluency</span>
              <h2 className="teacher-kpi-val">{kpis.avgScore || 75}%</h2>
            </div>
          </div>

          <div className="teacher-kpi-card">
            <div className="teacher-kpi-icon-wrap purple">
              <BookOpen size={22} />
            </div>
            <div className="teacher-kpi-content">
              <span className="teacher-kpi-label">Active Assignments</span>
              <h2 className="teacher-kpi-val">{assignments.length}</h2>
            </div>
          </div>
        </div>

        {/* Main Grid: Active Assignments & Student Analytics */}
        <div className="teacher-main-layout">
          {/* Left / Primary Column: Student Roster & Performance */}
          <div className="teacher-roster-section">
            <div className="section-head-bar">
              <div className="section-title-wrap">
                <BarChart3 size={20} className="text-indigo-400" />
                <h2 className="section-title">Student Cohort Performance</h2>
                <span className="section-count">({filteredStudents.length})</span>
              </div>

              {/* Filter Pills */}
              <div className="filter-chips-deck">
                <button 
                  className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-chip ${filterType === 'active' ? 'active' : ''}`}
                  onClick={() => setFilterType('active')}
                >
                  Streak Active
                </button>
                <button 
                  className={`filter-chip ${filterType === 'top_scorers' ? 'active' : ''}`}
                  onClick={() => setFilterType('top_scorers')}
                >
                  Top Fluency (80%+)
                </button>
                <button 
                  className={`filter-chip ${filterType === 'needs_practice' ? 'active' : ''}`}
                  onClick={() => setFilterType('needs_practice')}
                >
                  Needs Practice (&lt;70%)
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="table-search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text"
                placeholder="Search students by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Students Table */}
            <div className="table-responsive-container">
              {isLoading ? (
                <div className="teacher-loading-box">
                  <div className="spinner"></div>
                  <p>Loading cohort data...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="teacher-empty-box">
                  <Users size={36} className="text-slate-500" />
                  <p>No students match your current criteria.</p>
                </div>
              ) : (
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course & Year</th>
                      <th>Fluency Score</th>
                      <th>Level & XP</th>
                      <th>Streak</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar-badge">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                              <span className="student-name">{student.name}</span>
                              <span className="student-email">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="academic-tag">
                            <span>{student.course || 'B.Tech / CS'}</span>
                            <span className="academic-year-sub">{student.year || '2nd Year'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="score-badge-wrap">
                            <div className="score-meter-mini">
                              <div 
                                className={`score-meter-fill ${
                                  (student.overall_score || 0) >= 80 ? 'high' : 
                                  (student.overall_score || 0) >= 70 ? 'med' : 'low'
                                }`} 
                                style={{ width: `${Math.min(100, student.overall_score || 0)}%` }}
                              />
                            </div>
                            <span className="score-num">{student.overall_score || 0}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="level-xp-cell">
                            <span className="level-pill">Lvl {student.level || 1}</span>
                            <span className="xp-num">{student.xp || 0} XP</span>
                          </div>
                        </td>
                        <td>
                          <div className="streak-badge">
                            <Flame size={15} className="text-rose-400" />
                            <span>{student.streak || 0}d</span>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn-view-profile"
                            onClick={() => setSelectedStudent(student)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Column: Published Practice Assignments */}
          <div className="teacher-assignments-section">
            <div className="section-head-bar">
              <div className="section-title-wrap">
                <BookOpen size={20} className="text-purple-400" />
                <h2 className="section-title">Active Assignments</h2>
              </div>
            </div>

            <div className="assignments-stream">
              {assignments.length === 0 ? (
                <div className="empty-assignments-card">
                  <Sparkles size={28} className="text-purple-400 mb-2" />
                  <h4>No active assignments</h4>
                  <p>Assign speaking or vocabulary drills to guide your class practice.</p>
                  <button 
                    className="btn btn-secondary btn-sm mt-3"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create First Task
                  </button>
                </div>
              ) : (
                assignments.map(item => (
                  <div key={item.id} className="assignment-card">
                    <div className="assignment-card-header">
                      <span className="skill-tag">{item.skill_category || 'Speaking'}</span>
                      <button 
                        className="btn-del-assignment" 
                        title="Delete assignment"
                        onClick={() => handleDeleteAssignment(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="assignment-card-title">{item.title}</h3>
                    <p className="assignment-card-desc">{item.description}</p>
                    
                    <div className="assignment-card-footer">
                      <div className="due-date-pill">
                        <Calendar size={13} />
                        <span>Due: {item.due_date || 'Flexible'}</span>
                      </div>
                      <span className="target-score-pill">
                        Target: {item.target_score || 75}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal: Create Assignment */}
        {showCreateModal && (
          <div className="teacher-modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <div className="teacher-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="teacher-modal-header">
                <h3>Publish Practice Assignment</h3>
                <button 
                  className="btn-close-dialog"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="teacher-modal-form">
                <div className="form-group">
                  <label>Assignment Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 2-Minute Elevator Pitch Challenge"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Skill Category</label>
                    <select 
                      value={assignmentForm.skill_category}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, skill_category: e.target.value })}
                    >
                      <option value="Speaking">Speaking & Fluency</option>
                      <option value="Vocabulary">Vocabulary Expansion</option>
                      <option value="AI Interview">Mock Interview Drill</option>
                      <option value="Presentation">Presentation Pitch</option>
                      <option value="Pronunciation">Pronunciation Precision</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Fluency Score (%)</label>
                    <input 
                      type="number"
                      min="50"
                      max="100"
                      value={assignmentForm.target_score}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, target_score: parseInt(e.target.value) || 75 })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date"
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Prompt & Guidance</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe what students need to record or prepare (e.g. Speak for 90 seconds without filler words like 'um' and 'basically')..."
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  />
                </div>

                <div className="teacher-modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish to Students'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Student Details */}
        {selectedStudent && (
          <div className="teacher-modal-backdrop" onClick={() => setSelectedStudent(null)}>
            <div className="teacher-modal-dialog student-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="teacher-modal-header">
                <div className="flex items-center gap-3">
                  <div className="student-avatar-badge large">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                  </div>
                </div>
                <button 
                  className="btn-close-dialog"
                  onClick={() => setSelectedStudent(null)}
                >
                  ✕
                </button>
              </div>

              <div className="student-detail-content">
                <div className="student-stats-row">
                  <div className="stat-box">
                    <span className="stat-label">Fluency Score</span>
                    <span className="stat-value text-emerald-400">{selectedStudent.overall_score || 0}%</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">XP Earned</span>
                    <span className="stat-value text-amber-400">{selectedStudent.xp || 0}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Streak Days</span>
                    <span className="stat-value text-rose-400">{selectedStudent.streak || 0} 🔥</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Current Level</span>
                    <span className="stat-value text-indigo-400">Lvl {selectedStudent.level || 1}</span>
                  </div>
                </div>

                <div className="student-info-grid">
                  <div className="info-item">
                    <label>Institution</label>
                    <p>{selectedStudent.institution || 'Not specified'}</p>
                  </div>
                  <div className="info-item">
                    <label>Course / Major</label>
                    <p>{selectedStudent.course || 'Not specified'}</p>
                  </div>
                  <div className="info-item">
                    <label>Academic Year</label>
                    <p>{selectedStudent.year || 'Not specified'}</p>
                  </div>
                  <div className="info-item">
                    <label>Primary Goal</label>
                    <p>{selectedStudent.primary_goal || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="teacher-modal-actions">
                <button 
                  className="btn btn-secondary w-full"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
