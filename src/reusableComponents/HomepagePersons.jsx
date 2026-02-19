import { useNavigate } from "react-router-dom";
import Webassets from "../assets/Assets";
import HomepageButton from "./HomepageButton";

const HomepagePersons = ({ type }) => {
  const navigate = useNavigate();
  return (
    <section className="w-full flex flex-col items-start gap-6">
      {type === "BTN" ? (
        <>
          <div className="mb-2">
            <div
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", display: "inline-block" }}>
              <HomepageButton text="Get Started" icon={Webassets.arrowMark} />
            </div>
          </div>
          <div className="bg-(--bg-primary) flex items-center justify-center rounded-4xl overflow-hidden w-51 py-1">
            <ul className="flex w-full translate-x-6 items-center justify-center">
              <img className="" src={Webassets.person1} alt="" />
              <img
                className="-translate-x-4 z-10"
                src={Webassets.person1}
                alt=""
              />
              <img
                className="-translate-x-8 z-10"
                src={Webassets.person1}
                alt=""
              />
              <img
                className="-translate-x-12 z-10"
                src={Webassets.person1}
                alt=""
              />
            </ul>
          </div>
          <p className="text-2xl">Explore 1000+ resources</p>
          <p className="text-lg text-(--text-secondary)">
            Over 1,000 articles on emerging tech trends and breakthroughs.
          </p>
          <HomepageButton text="Explore Resources" icon={Webassets.arrowMark} />
        </>
      ) : (
        <div className="flex gap-4 items-center py-5 px-6 bg-(--bg-secondary) rounded-lg">
          <div>
            <p className="Download By text-(--text-secondary)">Downloaded By</p>
            <p className="text-lg">10K+ Users</p>
          </div>
          <div className="bg-(--bg-primary) flex items-center justify-center rounded-4xl overflow-hidden w-51 py-1">
            <ul className="flex w-full translate-x-6 items-center justify-center">
              <img className="" src={Webassets.person1} alt="" />
              <img
                className="-translate-x-4 z-10"
                src={Webassets.person1}
                alt=""
              />
              <img
                className="-translate-x-8 z-10"
                src={Webassets.person1}
                alt=""
              />
              <img
                className="-translate-x-12 z-10"
                src={Webassets.person1}
                alt=""
              />
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomepagePersons;
