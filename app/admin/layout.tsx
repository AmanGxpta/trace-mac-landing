import "./admin.css";

/**
 * Wraps every admin route in the console surface.
 *
 * The class does real work beyond styling: it's the hook the stylesheet uses
 * to switch the site's custom cursor back to the system one and to drop the
 * ambient background grid, both of which belong on a landing page and get in
 * the way of a table you are reading under time pressure.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-shell">{children}</div>;
}
