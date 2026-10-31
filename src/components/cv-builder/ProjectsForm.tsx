"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCVStore } from "./store";
import { BulletModal } from "./BulletModal";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

/*
 * Projects: class projects, personal projects, hackathons. For a first job they
 * count as much as experience, so they get their own step and their own
 * section on the resume (see CVPreview and the PDF).
 */

const Wrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const Card = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--rj-ink) 2%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 8%, transparent);
`;

const Remove = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--rj-ink-2);
  background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
  cursor: pointer;

  &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 10%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Group = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: color-mix(in srgb, var(--rj-ink) 80%, transparent);

  small { font-weight: 400; color: var(--rj-ink-3); }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
  border-radius: 12px;
  font-size: 16px;
  color: var(--rj-ink);
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  outline: none;
  transition: all 0.2s ease;

  &:focus { border-color: color-mix(in srgb, var(--rj-ink) 30%, transparent); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--rj-ink) 5%, transparent); }
  &::placeholder { color: color-mix(in srgb, var(--rj-ink) 25%, transparent); }
`;

const Row = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 640px) { flex-direction: column; }
`;

const Line = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px 12px 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 8%, transparent);

  span { padding-top: 6px; color: var(--rj-ink-3); }
  textarea { flex: 1; min-height: 44px; padding: 4px 8px; border: 1px solid transparent; border-radius: 6px; resize: none; font: 14px/1.5 inherit; color: var(--rj-ink); background: transparent; }
  textarea:focus { outline: none; border-color: color-mix(in srgb, var(--rj-ink) 20%, transparent); background: color-mix(in srgb, var(--rj-ink) 5%, transparent); }
  textarea::placeholder { color: color-mix(in srgb, var(--rj-ink) 30%, transparent); }
  button { padding: 6px; border: 0; display: flex; color: var(--rj-ink-3); background: none; cursor: pointer; }
  button:hover { color: var(--rj-ink); }
`;

const Small = styled.button`
  padding: 14px;
  border: 1px dashed color-mix(in srgb, var(--rj-ink) 25%, transparent);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: 500 14px var(--rj-font);
  color: var(--rj-ink);
  background: color-mix(in srgb, var(--rj-ink) 4%, transparent);
  cursor: pointer;

  &:hover { background: color-mix(in srgb, var(--rj-ink) 8%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Add = styled(Small)`
  padding: 20px;
  border-radius: 16px;
  font-size: 15px;
  color: color-mix(in srgb, var(--rj-ink) 75%, transparent);
`;

const Plus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
const Cross = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>;

const EMPTY = { name: "", role: "", url: "", startDate: "", endDate: "", bullets: [] as string[] };

export function ProjectsForm() {
  const { cv, addProject, updateProject, removeProject, addProjectBullet, updateProjectBullet, removeProjectBullet } = useCVStore();
  const [suggestFor, setSuggestFor] = useState<number | null>(null);
  const projects = cv.projects || [];

  // Start with one empty card. Read the store directly: an effect that runs
  // twice (React dev mode) must not add two.
  useEffect(() => {
    if ((useCVStore.getState().cv.projects || []).length === 0) addProject({ ...EMPTY });
  }, [projects.length, addProject]);

  return (
    <Wrap initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <AnimatePresence>
        {projects.map((p, i) => (
          <Card key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
            {projects.length > 1 && <Remove type="button" onClick={() => removeProject(i)} aria-label={`Remove ${p.name || "this project"}`}><Cross /></Remove>}

            <Group>
              <Label htmlFor={`project-name-${i}`}>Project name</Label>
              <Input id={`project-name-${i}`} value={p.name} placeholder="e.g. CourseMap, course planning web app" onChange={(e) => updateProject(i, { name: e.target.value })} />
            </Group>

            <Row>
              <Group>
                <Label htmlFor={`project-role-${i}`}>Your role or the tools <small>(optional)</small></Label>
                <Input id={`project-role-${i}`} value={p.role || ""} placeholder="e.g. React, Node.js, PostgreSQL" onChange={(e) => updateProject(i, { role: e.target.value })} />
              </Group>
              <Group>
                <Label htmlFor={`project-url-${i}`}>Link <small>(optional)</small></Label>
                <Input id={`project-url-${i}`} value={p.url || ""} placeholder="e.g. github.com/you/coursemap" onChange={(e) => updateProject(i, { url: e.target.value })} />
              </Group>
            </Row>

            <Row>
              <Group>
                <Label>Start date</Label>
                <MonthYearPicker placeholder="Select start date" value={p.startDate || ""} onChange={(val) => updateProject(i, { startDate: val })} />
              </Group>
              <Group>
                <Label>End date</Label>
                <MonthYearPicker placeholder="Select end date" value={p.endDate || ""} onChange={(val) => updateProject(i, { endDate: val })} showPresent />
              </Group>
            </Row>

            <Group>
              <Label as="span">What you built and what came of it</Label>
              {(p.bullets || []).map((b, j) => (
                <Line key={j}>
                  <span aria-hidden="true">•</span>
                  <textarea value={b} aria-label={`Line ${j + 1}`} placeholder="e.g. Built a course planner that checks prerequisites, used by 120 students" onChange={(e) => updateProjectBullet(i, j, e.target.value)} />
                  <button type="button" onClick={() => removeProjectBullet(i, j)} aria-label={`Remove line ${j + 1}`}><Cross /></button>
                </Line>
              ))}
              <Row>
                <Small type="button" style={{ flex: 1 }} onClick={() => addProjectBullet(i, "")}><Plus />Add a line</Small>
                <Small type="button" style={{ flex: 1 }} onClick={() => setSuggestFor(i)} disabled={!p.name.trim()}>Suggest lines</Small>
              </Row>
            </Group>
          </Card>
        ))}
      </AnimatePresence>

      <Add type="button" onClick={() => addProject({ ...EMPTY })}><Plus />Add another project</Add>

      {suggestFor !== null && projects[suggestFor] && (
        <BulletModal
          isOpen
          onClose={() => setSuggestFor(null)}
          onAdd={(bullet) => addProjectBullet(suggestFor, bullet)}
          jobTitle={projects[suggestFor].name}
          company={projects[suggestFor].role || "Personal project"}
        />
      )}
    </Wrap>
  );
}

export default ProjectsForm;
