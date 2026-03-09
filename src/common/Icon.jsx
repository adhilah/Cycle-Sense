/**
 * Icon — thin wrapper around Google Material Icons Round
 *
 * Requires the font to be loaded in index.html or global CSS:
 *   <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
 *
 * Props:
 *  - name    {string}  Material icon ligature name, e.g. "water_drop"
 *  - size    {number}  font-size in px (default 20)
 *  - color   {string}  CSS color value (default "inherit")
 *  - style   {object}  additional inline styles
 *  - className {string} extra class names
 */
export default function Icon({ name, size = 20, color = "inherit", style = {}, className = "" }) {
  return (
    <span
      className={`material-icons-round ${className}`.trim()}
      aria-hidden="true"
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        flexShrink: 0,
        ...style,
      }}
    >
      {name}
    </span>
  );
}