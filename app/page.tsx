import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub of <br /> Events You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Workshops, Conferences, Meetups, and More
      </p>
      <ExploreBtn />
      <div className="mt-10 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
