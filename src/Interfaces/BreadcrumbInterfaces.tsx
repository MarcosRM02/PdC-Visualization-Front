export interface IBreadcrumbItem {
  label: string;
  path: string;
}

export interface IBreadcrumbProps {
  items: IBreadcrumbItem[];
}
