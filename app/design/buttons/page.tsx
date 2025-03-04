"use client";

import { Button, Toggle } from "@/components/custom/buttons";
import { useState } from "react";

export default function ButtonsDemo() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [toggleStates, setToggleStates] = useState({
    like: false,
    favorite: false,
    bookmark: false,
    notification: false,
    visibility: false,
    power: false,
    completed: false,
  });

  // Helper function to simulate loading state
  const simulateLoading = (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Handle toggle state change
  const handleToggleChange = (name: keyof typeof toggleStates) => {
    setToggleStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10">UI Components Demo</h1>

      <div className="space-y-12">
        {/* Button Variants */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </section>

        {/* Toggle Variants */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Toggle Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Toggle
              variant="primary"
              isPressed={toggleStates.like}
              onPressedChange={() => handleToggleChange("like")}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 11V19C7 19.5523 7.44772 20 8 20H10M7 11V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V11M7 11H5C4.44772 11 4 11.4477 4 12V19C4 19.5523 4.44772 20 5 20H7M17 11H19C19.5523 11 20 11.4477 20 12V19C20.0002 19.5523 19.5525 20 19.0002 20H14.5M17 11V8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {toggleStates.like ? "Liked" : "Like"}
              </span>
            </Toggle>
            <Toggle
              variant="secondary"
              isPressed={toggleStates.favorite}
              onPressedChange={() => handleToggleChange("favorite")}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.255L8.90702 8.255L11.993 2L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {toggleStates.favorite ? "Favorited" : "Favorite"}
              </span>
            </Toggle>
            <Toggle
              variant="destructive"
              isPressed={toggleStates.bookmark}
              onPressedChange={() => handleToggleChange("bookmark")}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {toggleStates.bookmark ? "Bookmarked" : "Bookmark"}
              </span>
            </Toggle>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">
              Small Button
            </Button>
            <Button variant="primary">Default Size</Button>
            <Button variant="primary" size="lg">
              Large Button
            </Button>
          </div>
        </section>

        {/* Toggle Sizes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Toggle Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Toggle
              variant="primary"
              size="sm"
              isPressed={toggleStates.notification}
              onPressedChange={() => handleToggleChange("notification")}
            >
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Notify
              </span>
            </Toggle>
            <Toggle
              variant="primary"
              isPressed={toggleStates.visibility}
              onPressedChange={() => handleToggleChange("visibility")}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Visibility
              </span>
            </Toggle>
            <Toggle
              variant="primary"
              size="lg"
              isPressed={toggleStates.power}
              onPressedChange={() => handleToggleChange("power")}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.36 6.64001C19.6184 7.8988 20.4753 9.50246 20.8223 11.2482C21.1693 12.994 20.9909 14.8034 20.3096 16.4478C19.6284 18.0921 18.4748 19.4976 16.9948 20.4864C15.5148 21.4752 13.7749 22.0029 11.995 22.0029C10.2151 22.0029 8.47515 21.4752 6.99517 20.4864C5.51519 19.4976 4.36164 18.0921 3.68036 16.4478C2.99909 14.8034 2.82069 12.994 3.16772 11.2482C3.51475 9.50246 4.37162 7.8988 5.63 6.64001"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Power
              </span>
            </Toggle>
          </div>
        </section>

        {/* Plain Buttons (no icons) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Plain Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* Loading State */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Loading States</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              isLoading={loading["load1"]}
              onClick={() => simulateLoading("load1")}
            >
              {loading["load1"] ? "Loading..." : "Click to Load"}
            </Button>
            <Button
              variant="secondary"
              isLoading={loading["load2"]}
              onClick={() => simulateLoading("load2")}
            >
              {loading["load2"] ? "Saving..." : "Save Changes"}
            </Button>
            <Button isLoading>Always Loading</Button>
          </div>
        </section>

        {/* Disabled */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Disabled Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled with Icon
            </Button>
            <Button variant="destructive" disabled>
              Disabled Destructive
            </Button>
          </div>
        </section>

        {/* Disabled Toggles */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Disabled Toggles</h2>
          <div className="flex flex-wrap gap-4">
            <Toggle variant="primary" disabled isPressed={false}>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Disabled Toggle
              </span>
            </Toggle>
            <Toggle variant="secondary" disabled isPressed={true}>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.255L8.90702 8.255L11.993 2L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Disabled (Pressed)
              </span>
            </Toggle>
          </div>
        </section>

        {/* Full Width */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Full Width Buttons</h2>
          <div className="space-y-3 max-w-md">
            <Button variant="primary" fullWidth>
              Full Width Button
            </Button>
            <Button variant="secondary" fullWidth>
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="7 10 12 15 17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download Report
              </span>
            </Button>
            <Button
              variant="destructive"
              fullWidth
              isLoading={loading["load3"]}
              onClick={() => simulateLoading("load3")}
            >
              {loading["load3"] ? "Processing..." : "Delete Account"}
            </Button>
            <Toggle
              variant="primary"
              fullWidth
              isPressed={toggleStates.completed}
              onPressedChange={() => handleToggleChange("completed")}
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22 4 12 14.01 9 11.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {toggleStates.completed ? "Completed" : "Mark as Complete"}
              </span>
            </Toggle>
          </div>
        </section>

        {/* Toggles Comparison */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Toggles Comparison</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-6">Not Pressed</h3>
              <div className="flex flex-wrap gap-4">
                <Toggle variant="primary" isPressed={false}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Like
                  </span>
                </Toggle>
                <Toggle variant="secondary" isPressed={false}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.255L8.90702 8.255L11.993 2L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Favorite
                  </span>
                </Toggle>
                <Toggle variant="destructive" isPressed={false}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Save
                  </span>
                </Toggle>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-6">Pressed</h3>
              <div className="flex flex-wrap gap-4">
                <Toggle variant="primary" isPressed={true}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Liked
                  </span>
                </Toggle>
                <Toggle variant="secondary" isPressed={true}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75L5.82802 20.995L7.00702 14.122L2.00702 9.255L8.90702 8.255L11.993 2L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Favorited
                  </span>
                </Toggle>
                <Toggle variant="destructive" isPressed={true}>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Saved
                  </span>
                </Toggle>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
