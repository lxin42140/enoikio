import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import FullListings from "./FullListingsTest";
import { Listing, Request } from "./TestDrivers";

configure({ adapter: new Adapter() });

describe("<FullListings />", () => {
  it("should render <Spinner /> if listings are loading ", () => {
    const fullListings = [Listing];
    const wrapper = shallow(
      <FullListings loading fullListings={fullListings} />
    );
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it("should not render <Listing /> if listings are loading ", () => {
    const fullListings = [Listing];
    const wrapper = shallow(
      <FullListings loading fullListings={fullListings} />
    );
    expect(wrapper.find(Listing)).toHaveLength(0);
  });

  it("should not render <Spinner /> if listings are done loading ", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings
        fullListings={fullListings}
        allRequests={allRequests}
        loading={false}
      />
    );
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });

  it("should render <Listing /> if listings are done loading ", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings
        fullListings={fullListings}
        allRequests={allRequests}
        loading={false}
      />
    );
    expect(wrapper.find(Listing)).toHaveLength(1);
  });

  it("should render <Listing /> if user is not authenticated", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings
        fullListings={fullListings}
        allRequests={allRequests}
        loading={false}
        isAuthenticated={false}
      />
    );
    expect(wrapper.find(Listing)).toHaveLength(1);
  });

  it("should render 5 <Listing /> if fullListings have length of 5", () => {
    const fullListings = [Listing, Listing, Listing, Listing, Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    expect(wrapper.find(Listing)).toHaveLength(5);
  });

  it("should render <h3> if fullListings length less than one", () => {
    const fullListings = [];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    expect(wrapper.find("h3")).toHaveLength(1);
  });

  it("should not render <h3> if fullListings length >= one", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    expect(wrapper.find("h3")).toHaveLength(0);
  });

  it("should render <h3> if requests length less than one", () => {
    const fullListings = [Listing];
    const allRequests = [];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true });
    expect(wrapper.find("h3")).toHaveLength(1);
  });

  it("should not render <h3> if requests length >= one", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true });
    expect(wrapper.find("h3")).toHaveLength(0);
  });

  it("should render 5 <Requests/> if allRequests have length of 5", () => {
    const fullListings = [Listing];
    const allRequests = [Request, Request, Request, Request, Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true });
    expect(wrapper.find(Request)).toHaveLength(5);
  });

  it("should not render <Requests/> if viewRequest is false and viewListing is true", () => {
    const fullListings = [Listing];
    const allRequests = [Request, Request, Request, Request, Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: false, viewListing: true });
    expect(wrapper.find(Request)).toHaveLength(0);
  });

  it("should not render <Listing/> if viewRequest is true and viewListing is false", () => {
    const fullListings = [Listing];
    const allRequests = [Request, Request, Request, Request, Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    expect(wrapper.find(Listing)).toHaveLength(0);
  });

  it("should render <Listing/> if Listing button is clicked", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    wrapper.find("button").at(0).simulate("click");
    expect(wrapper.find(Listing)).toHaveLength(1);
  });

  it("should not render <Request/> if Listing button is clicked", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    wrapper.find("button").at(0).simulate("click");
    expect(wrapper.find(Request)).toHaveLength(0);
  });

  it("should render <Request/> if Requests button is clicked", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: false, viewListing: true });
    wrapper.find("button").at(2).simulate("click");
    expect(wrapper.find(Request)).toHaveLength(1);
  });

  it("should not render <Listing/> if Requests button is clicked", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    wrapper.find("button").at(2).simulate("click");
    expect(wrapper.find(Listing)).toHaveLength(0);
  });

  it("should render <Link/> when requests are shown", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: false, viewListing: true });
    wrapper.find("button").at(2).simulate("click");
    expect(wrapper.find(Link)).toHaveLength(1);
  });

  it("should render <Link/> redirect user to /auth when user is unauthenticated", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    expect(wrapper.find(Link).props().to).toBe("/auth");
  });

  it("should not render <Link/> redirect user to /auth when user is authenticated", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings
        fullListings={fullListings}
        allRequests={allRequests}
        isAuthenticated
      />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    expect(wrapper.find(Link).props().to).toBe("/new-request");
  });

  it("should render <Link/> to redirect user to /new-request when user is authenticated", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings
        fullListings={fullListings}
        allRequests={allRequests}
        isAuthenticated
      />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    expect(wrapper.find(Link).props().to).toBe("/new-request");
  });

  it("should not render <Link/> to redirect user to /new-request when user is unauthenticated", () => {
    const fullListings = [Listing];
    const allRequests = [Request];
    const wrapper = shallow(
      <FullListings fullListings={fullListings} allRequests={allRequests} />
    );
    wrapper.setState({ viewRequest: true, viewListing: false });
    expect(wrapper.find(Link).props().to).toBe("/auth");
  });
});
