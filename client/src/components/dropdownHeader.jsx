"use client";

import { Dropdown } from "flowbite-react";

export default function Services() {
  return (
    <Dropdown label="Services">
      <Dropdown.Item>Carataker Booking</Dropdown.Item>
      <Dropdown.Item>Accomodation</Dropdown.Item>
      <Dropdown.Item>Career </Dropdown.Item>
      <Dropdown.Item>Add ons</Dropdown.Item>
      <Dropdown.Item>Events</Dropdown.Item>
      <Dropdown.Item></Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>Separated link</Dropdown.Item>
    </Dropdown>
  );
}
