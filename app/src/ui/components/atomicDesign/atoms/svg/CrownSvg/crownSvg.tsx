/**
 * @deprecated Use the King Charles III "Tudor Crown" instead of the Queen Elizbaeth "St Edward's Crown"
 */
export const SvgCrown = ({ colour }: { colour: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 132 97"
    height="30"
    width="36"
    version="1.1"
    className="govuk-modal-dialogue__crown"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fill={colour}>
        <path d="M25 30.2C28.5 31.7 32.7 30 34.1 26.5 35.6 22.9 33.9 18.7 30.2 17.3 26.6 15.9 22.6 17.6 21.1 21.2 19.7 24.7 21.4 28.7 25 30.2L25 30.2ZM9 39.5C12.6 41 16.8 39.3 18.2 35.8 19.7 32.2 18 28 14.3 26.7 10.7 25.2 6.7 26.9 5.2 30.5 3.8 34 5.5 38 9 39.5L9 39.5ZM4.4 57.2C7.9 58.7 12.1 57 13.5 53.4 15 49.8 13.3 45.7 9.6 44.3 6.1 42.8 2 44.6 0.5 48.1 -0.9 51.6 0.8 55.7 4.4 57.2L4.4 57.2ZM42.7 35.8C46.2 37.3 50.4 35.6 51.8 32 53.3 28.4 51.6 24.3 47.9 22.9 44.3 21.4 40.3 23.2 38.8 26.7 37.5 30.3 39.2 34.4 42.7 35.8L42.7 35.8ZM107.1 30.2C103.5 31.7 99.3 30 98 26.5 96.5 22.9 98.2 18.7 101.8 17.3 105.4 15.9 109.5 17.6 111 21.2 112.3 24.7 110.6 28.7 107.1 30.2L107.1 30.2ZM123 39.5C119.4 41 115.3 39.3 113.9 35.8 112.4 32.2 114.1 28 117.6 26.7 121.2 25.2 125.3 26.9 126.8 30.5 128.3 34 126.5 38 123 39.5L123 39.5ZM127.7 57.2C124.1 58.7 119.9 57 118.5 53.4 117 49.8 118.7 45.7 122.4 44.3 126 42.8 130.1 44.6 131.6 48.1 132.9 51.6 131.2 55.7 127.7 57.2L127.7 57.2ZM89.3 35.8C85.7 37.3 81.5 35.6 80.1 32 78.7 28.4 80.3 24.3 84 22.9 87.6 21.4 91.7 23.2 93.2 26.7 94.6 30.3 92.9 34.4 89.3 35.8L89.3 35.8ZM69.7 17.7L69.7 17.7 78.6 22.4 78.6 9.3 69.7 12.1 69.7 12.1C69.5 11.8 69.2 11.5 68.8 11.2L68.8 11.2 72.4 0 66 0 59.6 0 63.1 11.2 63.1 11.2C62.8 11.5 62.5 11.7 62.2 12.1L62.2 12.1 53.4 9.3 53.4 22.4 62.2 17.7 62.2 17.7C62.5 18 62.8 18.4 63.1 18.6L58.1 34C58.1 34 58.1 34 58.1 34.1L58.1 34.1 58.1 34.1C57.9 34.9 57.7 35.7 57.7 36.5 57.7 40.6 60.8 44 64.7 44.6L64.9 44.6C65.2 44.6 65.6 44.7 65.9 44.7 66.3 44.7 66.6 44.7 66.9 44.6L67.1 44.6C71.1 44 74.2 40.5 74.2 36.5 74.2 35.7 74.1 34.8 73.8 34.1L73.8 34.1 73.8 34.1C73.8 34.1 73.8 34.1 73.8 34L68.7 18.6C69.1 18.4 69.4 18 69.7 17.7L69.7 17.7ZM66 92.8C82.9 92.8 98.8 93.9 113.1 96 117.1 79.1 122 69.3 127.1 62.5L117.5 59.1C118.5 64 118.6 66.3 117.5 69.3 116 67.9 114.5 65 113.3 60.6L108.6 76C111.4 74 113.6 72.8 116.1 72.7 111.7 82.1 106.1 84.6 102.5 83.9 98.2 83.1 96.2 79.3 96.9 76 97.9 71.3 102.6 70.1 104.9 75.5 109.2 66.8 101.9 64.1 97.3 66.7 104.4 59.5 105.2 53.2 99.4 45.6 91.4 51.7 91.3 57.9 94.9 66.4 90.2 61 82.8 63.9 85.4 72.6 88.8 67.4 93.3 70.6 92.6 75.7 92 80 86.2 83.5 79.1 82.9 68.8 82 68.2 74.9 67.9 69.1 70.4 68.6 75 70.9 78.9 76.4L80.2 60C76.1 64.4 72.2 65.3 67.9 65.4 69.3 61 75.9 53.8 75.9 53.8L66.4 53.8 66.4 53.8 66.4 53.8 55.5 53.8C55.5 53.8 61.9 61 63.4 65.4 59.2 65.3 55.4 64.4 51.1 60L52.5 76.4C56.4 70.9 61 68.7 63.4 69.1 63.1 74.9 62.5 81.9 52.3 82.9 45.1 83.5 39.4 80 38.8 75.7 38.1 70.7 42.6 67.4 45.9 72.6 48.6 63.9 41.3 61 36.5 66.4 40.2 57.9 40.1 51.7 31.9 45.6 26.1 53.2 26.9 59.5 34.1 66.7 29.4 64.1 22.2 66.8 26.4 75.5 28.7 70 33.5 71.3 34.5 76 35.2 79.3 33.2 83.1 28.8 83.9 25.3 84.6 19.8 82.1 15.3 72.7 17.8 72.8 20 74 22.8 76L18.1 60.6C16.9 65 15.4 67.8 13.8 69.3 12.7 66.3 12.9 64 13.8 59.1L4.3 62.5C9.3 69.4 14.2 79.2 18.3 96 33.1 93.9 49.1 92.8 66 92.8L66 92.8Z" />
      </g>
    </g>
  </svg>
);
