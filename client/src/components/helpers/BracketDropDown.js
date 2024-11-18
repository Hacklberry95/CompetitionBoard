import React from "react";
import Dropdown from "react-multilevel-dropdown";
import { useDispatch } from "react-redux";
import { setSelectedBracket } from "../../redux/slices/bracketSlice";

const BracketDropdown = ({ brackets }) => {
  const dispatch = useDispatch();

  const handleSelectBracket = (bracketId) => {
    console.log("Selected Bracket ID:", bracketId);
    dispatch(setSelectedBracket(bracketId));
  };

  const groupBrackets = (brackets) => {
    return brackets.reduce((acc, bracket) => {
      const { Division, Gender, Arm, WeightClass, id } = bracket;

      if (!acc[Division]) acc[Division] = {};
      if (!acc[Division][Gender]) acc[Division][Gender] = {};
      if (!acc[Division][Gender][Arm]) acc[Division][Gender][Arm] = [];
      acc[Division][Gender][Arm].push({ WeightClass, id });

      return acc;
    }, {});
  };

  const groupedBrackets = groupBrackets(brackets);

  if (!brackets.length) {
    return <div>No brackets available</div>;
  }

  return (
    <Dropdown title="Select Bracket">
      {Object.entries(groupedBrackets).map(([division, genders]) => (
        <Dropdown.Item key={division}>
          {division}
          <Dropdown.Submenu>
            {Object.entries(genders).map(([gender, arms]) => (
              <Dropdown.Item key={gender}>
                {getGenderLabel(gender)}
                <Dropdown.Submenu>
                  {Object.entries(arms).map(([arm, weightClasses]) => (
                    <Dropdown.Item key={arm}>
                      {getArmLabel(arm)}
                      <Dropdown.Submenu>
                        {weightClasses.map(({ WeightClass, id }) => (
                          <Dropdown.Item
                            key={id}
                            onClick={() => handleSelectBracket(id)}
                          >
                            {WeightClass}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
            ))}
          </Dropdown.Submenu>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

// Utility functions for labels
const getGenderLabel = (gender) => {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    default:
      return "Other";
  }
};

const getArmLabel = (arm) => {
  switch (arm) {
    case "R":
      return "Right";
    case "L":
      return "Left";
    case "B":
      return "Both";
    default:
      return "N/A";
  }
};

export default BracketDropdown;
