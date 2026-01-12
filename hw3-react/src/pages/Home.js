export default function Home() {
  return (
    <>
      <h2 className="mb-3">Welcome</h2>
      <p>
        This is an application created to display South American country
        information through React. It pulls data from a public API. This
        demonstrates routing, API data handling and creating visualizations of
        data.
      </p>
      <ul>
        <li>
          <strong>LIST:</strong> Provides information and shows the flags of all
          of the South American countries.
        </li>

        <li>
          <strong>Population:</strong> Displays a bar chart that compares the
          population sizes of diferent South American countries. It's not a
          contest, but if it was, Brazil would be the winner by far. (I've been
          working on this for a bit now and everything I'm writing looks so
          bland I'm afraid I'll be accused of using AI if I don't slip in
          something more human sounding! It also occurs to me that some very
          lazy person could also just ask an AI to write something silly in an
          attempt to do the same. However it's quite unlikely that some AI would
          be so reflective and conversational about it.)
        </li>

        <li>
          <strong>Custom:</strong> This is a bar chart showing the land area
          controlled by each country in America.
        </li>
      </ul>
    </>
  );
}
