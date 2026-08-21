export interface BugItem {
  id: string;
  title: string;
  badge: string;
  severity: 'Critical' | 'High' | 'Medium';
  oldIssue: string;
  fixedSolution: string;
  codeDiffOld: string;
  codeDiffNew: string;
}

export interface SectionSnippet {
  id: string;
  name: string;
  icon: string;
  lineRange: string;
  description: string;
}
