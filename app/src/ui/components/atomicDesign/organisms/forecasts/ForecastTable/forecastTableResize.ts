interface SideData {
  side: "left" | "right";
  i: number;
  querySelector: string;
  items: NodeListOf<HTMLTableCellElement>;
}

const DESKTOP_BREAKPOINT = 769;

const forecastTableResize = () => {
  let frame: ReturnType<typeof requestAnimationFrame>;

  // When the document resizes, resize our table.
  const resizeObserver = new ResizeObserver(() => {
    frame = requestAnimationFrame(animateFirstFrame);
  });
  resizeObserver.observe(document.body);

  /**
   * Animation table:
   *
   * Frame 1 includes "animateFirstFrame" and "animateSubsequentFrame"
   * The goal of Frame 1 is to run `document.querySelectorAll` to...
   * 1. Wait until React DOM is done before fetching references
   * 2. Get a reference to the relevant TDs once instead of every frame (performance)
   *
   * Frame 2 and beyond do not need to run `document.querySelector`
   * (except for grabbing a specific cell in a row, potential TODO here?)
   */
  const animateFirstFrame = () => {
    const table = document.getElementById("ifspa-forecast-table") as HTMLTableElement;

    const tds: SideData[] = [
      {
        side: "left",
        i: 1,
        querySelector: ".ifspa-forecast-table-left-col-1",
        items: document.querySelectorAll(".ifspa-forecast-table-left-col-1"),
      },
      {
        side: "right",
        i: 1,
        querySelector: ".ifspa-forecast-table-right-col-1",
        items: document.querySelectorAll(".ifspa-forecast-table-right-col-1"),
      },
      {
        side: "right",
        i: 2,
        querySelector: ".ifspa-forecast-table-right-col-2",
        items: document.querySelectorAll(".ifspa-forecast-table-right-col-2"),
      },
      {
        side: "right",
        i: 3,
        querySelector: ".ifspa-forecast-table-right-col-3",
        items: document.querySelectorAll(".ifspa-forecast-table-right-col-3"),
      },
    ];

    const animateSubsequentFrame = () => {
      // Enable our sticky-columns on a DESKTOP environment.
      // Otherwise, revert back to mobile layout.
      const documentBounds = document.body.getBoundingClientRect();
      const desktopResolution = documentBounds.width > DESKTOP_BREAKPOINT;

      /**
       * Accumulated left/right width values to add a margin to the side of the table.
       * This margin allows us to slide in the sticky columns in the gap left behind.
       */
      const accum = {
        left: 0,
        right: 0,
      };

      for (const { side, items } of tds) {
        /**
         * Run WIDTH calculations to calculate the width of the sticky column
         *
         * 1. Reset each TD in the column to make sure they are in the default size
         * 2. Use a tape measure on each TD to find out their widths
         * 3. With the greatest width, set values on the TD.
         */
        if (desktopResolution) {
          let maxWidthForColumn = 0;

          for (const td of items) {
            td.style[side] = "unset";
            td.style.width = "unset";
            td.style.height = "unset";
            td.style.maxWidth = "unset";
            td.style.minWidth = "unset";
            td.style.display = "unset";
            td.style.position = "unset";

            const bounds = td.getBoundingClientRect();
            maxWidthForColumn = Math.max(maxWidthForColumn, bounds.width);
          }

          for (const td of items) {
            td.style[side] = `${accum[side]}px`;
            td.style.width = maxWidthForColumn + "px";
            td.style.maxWidth = maxWidthForColumn + "px";
            td.style.minWidth = maxWidthForColumn + "px";
            td.style.display = "unset";
            td.style.position = "absolute";
          }

          accum[side] += maxWidthForColumn;
        } else {
          for (const td of items) {
            td.style[side] = "unset";
            td.style.width = "unset";
            td.style.height = "unset";
            td.style.maxWidth = "unset";
            td.style.minWidth = "unset";
            td.style.display = "table-cell";
            td.style.position = "sticky";
          }
        }
      }

      if (desktopResolution) {
        // Create gap for sticky columns to fit within
        table.style.marginLeft = accum.left + "px";
        table.style.marginRight = accum.right + "px";
        table.style.width = `calc(100% - ${accum.left}px - ${accum.right}px)`;
      } else {
        table.style.marginLeft = "unset";
        table.style.marginRight = "unset";
        table.style.width = "unset";
      }

      /**
       * Run HEIGHT calculations to calculate the height of the row.
       *
       * For each TR...
       * 1. Reset the TR to its normal height
       * 2. For each TD associated with a sticky column in the TR, find its normal height
       * 3. Use a tape measure on the TR and each sticky TD to find out their heights
       * 4. With the greatest height, set values on the TR and each sticky TD.
       */
      for (const tr of table.rows) {
        tr.style.height = "unset";

        const rowBounds = tr.getBoundingClientRect();
        let maxHeightForRow = rowBounds.height;

        for (const { querySelector } of tds) {
          const cell = tr.querySelector<HTMLTableCellElement>(querySelector);
          if (cell) {
            cell.style.height = "unset";
            const cellBounds = cell.getBoundingClientRect();
            maxHeightForRow = Math.max(maxHeightForRow, cellBounds.height);
          }
        }

        if (desktopResolution) {
          for (const { querySelector } of tds) {
            const cell = tr.querySelector<HTMLTableCellElement>(querySelector);
            if (cell) {
              cell.style.height = `${maxHeightForRow}px`;
            }
          }

          tr.style.height = `${maxHeightForRow}px`;
        }
      }
    };

    animateSubsequentFrame();
  };

  frame = requestAnimationFrame(animateFirstFrame);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
  };
};

export { forecastTableResize };
