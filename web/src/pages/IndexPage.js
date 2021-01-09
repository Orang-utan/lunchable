import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

function IndexPage() {
  return (
    <div className="dash-container">
      <div className="info-container outlineCardContainer">
        <div className="title-container">
          <div className="header3">What is Lunchable?</div>
        </div>
        <div>
          Lunchable is a way for you to eat virtually with friends and catch up
          with them, just like how you used to eat with friends on campus and
          have great convos over meals.
        </div>
        <br />
        <div>
          We built lunchable because we realized that many of us were drifting
          apart from friends over time, simply because we aren't eating together
          like we used to!
        </div>
        <br />
        <div className="title-container">
          <div className="header3">How does it work?</div>
        </div>
        <div>
          It's simple! When you feel like eating lunch, simply tap the extension
          and click start matching. We then do our best to automatically connect
          you to a friend to hang out with while you gys eat!{" "}
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
