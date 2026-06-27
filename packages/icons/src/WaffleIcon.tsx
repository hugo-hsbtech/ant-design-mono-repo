import { createIcon } from './createIcon';

/** 3×3 grid of dots — the "waffle" used by the product AppSwitcher. */
function WaffleSvg() {
  const cells = [0, 1, 2];
  const r = 2;
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      {cells.flatMap((row) =>
        cells.map((col) => (
          <circle key={`${row}-${col}`} cx={5 + col * 7} cy={5 + row * 7} r={r} />
        )),
      )}
    </svg>
  );
}
WaffleSvg.displayName = 'WaffleSvg';

export const WaffleIcon = createIcon(WaffleSvg);
