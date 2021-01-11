import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";

function IndexPage() {
  return (
    <div className="dash-container">
      <div className="info-container outlineCardContainer">
        <div className="title-container">
          <div className="header3">🌯 What is Lunchable?</div>
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
          <div className="header3">👀 How do I get started?</div>
        </div>
        <div>
          We're currently looking for beta-testers to help us test the product.
          If you would like to get access to our beta version, please fill out
          our{" "}
          <a href="/" style={{ color: "#3498db" }} target="_blank">
            interest form here
          </a>
          ! We'll get back to you asap with an invitation code.
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
