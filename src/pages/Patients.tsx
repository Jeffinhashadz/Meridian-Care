/**
 * Centralized patient directory — searchable, filterable clinical cards.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PATIENTS } from '../data/dummy';
import { formatDate } from '../utils/helpers';
import { logger } from '../utils/logger';

const FILTERS = ['All', 'Active', 'Critical', 'Inactive'] as const;

export function Patients() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATIENTS.filter((p) => {
      const matchStatus = filter === 'All' || p.status === filter;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.conditions.some((c) => c.toLowerCase().includes(q)) ||
        p.primaryDoctor.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [query, filter]);

  return (
    <div>
      <PageHeader
        title="Centralized patient profiles"
        description="Unified demographic, clinical flags, and care ownership in one roster."
      />

      <div className="toolbar">
        <label className="search" style={{ minWidth: 240 }}>
          <Search size={16} color="#6b858e" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              logger.debug('Patient search updated', { query: e.target.value });
            }}
            placeholder="Search name, condition, doctor…"
          />
        </label>
        <div className="chip-group">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-3">
        {list.map((p) => (
          <Link key={p.id} to={`/patients/${p.id}`} className="panel panel-pad" style={{ transition: 'transform 0.2s var(--ease)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div className="row-person">
                <Avatar initials={p.avatar} />
                <div>
                  <strong>{p.name}</strong>
                  <div className="sub">
                    {p.age} yrs · {p.gender} · {p.bloodType}
                  </div>
                </div>
              </div>
              <Badge status={p.status} />
            </div>
            <div className="tag-list" style={{ margin: '0.9rem 0' }}>
              {p.conditions.slice(0, 2).map((c) => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <span>{p.primaryDoctor}</span>
              <span>Last visit {formatDate(p.lastVisit)}</span>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 ? <div className="panel panel-pad empty">No patients match your filters.</div> : null}
    </div>
  );
}
