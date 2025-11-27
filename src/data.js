export const levels = [
  {
    id: 1,
    title: "Level 1: Beginner",
    maneuvers: [
      {
        id: "1.1",
        title: "Take-Off (Tail-In)",
        description:
          "Take off straight up from the landing area with a constant rate of climb and minimal lateral movement. Come to a complete stop at a height of approximately 3 feet (1 meter) without any vertical movement and minimal lateral movement.",
        variations: "N/A",
      },
      {
        id: "1.2",
        title: "Stationary Hover (Tail-In)",
        description:
          "Hold a stationary hover with no vertical or lateral movement and hold for 1 minute.",
        variations: "N/A",
      },
      {
        id: "1.3",
        title: "Lateral Hovering (Tail-In)",
        description:
          "From landing area take-off, hover for 10 seconds, move forward 10 feet (3 meters) and hover for 10 seconds, then move backward 20 feet (6 meters) and hover for 10 seconds. Next, move forward 10 feet (3 meters) until you are over the landing area and hover for 10 seconds, then move 10 feet (3 meters) to the left and hover for 10 seconds, move 20 feet (6 meters) to the right and hover for 10 seconds, and finally move 10 feet (3 meters) to the left until you are over the landing area and hover for 10 seconds, then land with the skids completely within the landing area. If you have done this correctly, the model should trace out a cross shape with the landing area at the center.",
        variations: "N/A",
      },
      {
        id: "1.4",
        title: "Multi-Level Hover (TailIn)",
        description:
          "Take off and hover at 3 feet (1 meter) for 5 seconds, then climb straigh up 6 feet (2 meters) and hover for 5 seconds. Next, descend 6 feet (2 meters) back to the original hover height and hover for 5 seconds and finally land the model with the skids completely within the landing area.",
        variations: "N/A",
      },
      {
        id: "1.5",
        title: "45-Degree Side Hovering",
        description:
          "Take off to a stationary hover at 3 feet (1 meter) for 5 seconds, rotate the nose of the model 45 degrees to the left and hover for 5 seconds, then rotate the nose of the model 45 degrees to the right and back to the original tail-in orientation and hover for 5 seconds. Next rotate the nose of the model 45 degrees to the right and hover for 5 seconds, and finally rotate the nose of the model 45 degrees left and back to the original tail-in orientation, hover for 5 seconds, and land with skids completely in the landing area.",
        variations: "N/A",
      },
      {
        id: "1.6",
        title: "90-Degree Side Hovering (Side-In)",
        description:
          "Take off to a stationary hover at 3 feet (1 meter) for 5 seconds, rotate the nose of the model 90 degrees to the left and hover for 5 seconds, then rotate the nose of the model 90 degrees to the right and back to the original tail-in orientation and hover for 5 seconds. Next rotate the nose of the model 90 degrees to the right and hover for 5 seconds, and finally rotate the nose of the model 90 degrees left and back to the original tail-in orientation, hover for 5 seconds, and land with skids completely in the landing area.",
        variations: "N/A",
      },
      {
        id: "1.7",
        title: "Diagonal Hovering (TailIn)",
        description:
          "From landing area take-off, hover for 5 seconds, then move the model diagonally to the front-left corner of an imaginary 30-foot (10-meter) box, hover for 5 seconds, and then return to the center of the box and hover for 5 seconds. Repeat this with the remaining 3 corners of the box in a clockwise fashion.",
        variations: "N/A",
      },
      {
        id: "1.8",
        title: "Constant-Heading Circle (Tail-In)",
        description:
          "From landing area take-off, hover for 5 seconds, move the model forward 15 feet (5 meters) and then move the model in a clockwise circle 30 feet (10 meters) in diameter while keeping the model in the tail-in orientation. Stop where you began the circle and hover for 5 seconds, then move backward to the landing area and hover for 5 seconds before landing with skids completely within the landing area. Repeat the same maneuver in a counter-clockwise manner.",
        variations: "CW, CCW",
      },
    ],
  },
  {
    id: 2,
    title: "Level 2: Basic Sport",
    maneuvers: [
      {
        id: "2.1",
        title: "Constant-Heading Figure 8",
        description:
          "From landing area take-off, hover for 5 seconds, move the model forward 15 feet (5 meters) and then move the model forward and to the right in a clockwise circle 15 feet (5 meters) in diameter while keeping the model in the tail-in orientation. When the model reaches the starting point for the first circle, then continue to move the model forward and to the left in a counter-clockwise circle 15 feet (5 meters) in diameter while keeping the model in the tail-in orientation. When you reach the starting point this time, move backward to the landing area and hover for 5 seconds before landing with skids completely within the landing area. Repeate in the opposite (reverse start) direction.",
        variations: "Forward, Reverse",
      },
      {
        id: "2.2",
        title: "Circuits",
        description:
          "Take off from landing area and hover at a height of 6 feet (2 meters) for 5 seconds, then move the model forward 30 feet (10 meters) and execute a left turn such that the model is now parallel to the flight line. Continue to fly straight and level for 30 feet (10 meters) and then climb to 60 feet (20 meters) and execute a 180-degree right turn (tracing left side of circuit) and fly straight and level for 60 feet (20 meters) parallel to the flight line. Now execute another 180-degree right turn (tracing right side of circuit) and fly straight and level for 30 feet (10 meters) and stop in a hover over the circuit starting point. Descend to 6 feet (2 meters) and rotate the nose of the model 90 degrees to the right to the tail-in orientation, move backward 30 feet (10 meters), hover over the landing area for 5 seconds, and then land with skids completely within the landing area. Repeat in opposite (counter-clockwise direction).",
        variations: "CW, CCW",
      },
      {
        id: "2.3",
        title: "Figure 8",
        description:
          "Begin as described in 2.1 Circuits except execute a 225-degree right turn after the climb-out to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. Repeat in opposite (reverse start) direction.",
        variations: "Forward (Tail-In), Reverse (NoseIn)",
      },
      {
        id: "2.4",
        title: "Side-In Landing",
        description:
          "From straight and level flight from right to left (left side-in landing), execute a 180-degree right turn away from the pilot once model passes the pilot. Begin to slow down and execute another 180-degree turn towards the pilot once the model passes the pilot again. Now begin to reduce speed and height to descend gradually to the landing area. Land with skids completely within the landing area in left side-in orientation. Repeat in opposite direction.",
        variations: "Left, Right",
      },
      {
        id: "2.5",
        title: "Stationary Pirouette",
        description:
          "From a stationary hover, turn the nose of the model 360 degrees either right or left while maintaining constant altitude and control. Repeat in the opposite direction.",
        variations: "Left, Right",
      },
      {
        id: "2.6",
        title: "180-Degree Stall Turn",
        description:
          "From straight and level flight from right to left (left-side stall turn), pull the model vertical with a smooth input of backward elevator until the nose is pointing perpendicular to the horizon. When the model stops climbing, rotate the nose of the model 180 degrees left and allow the model to fall the same distance that it climbed before pulling back into straight and level flight. Repeat a left-side stall turn with a right pirouette and a right-side stall turn with left and right pirouettes.",
        variations:
          "Left-Side/Left-Piro, LeftSide/Right-Piro, Right-Side/LeftPiro, Right-Side/Right-Piro",
      },
      {
        id: "2.7",
        title: "Inside Loop",
        description:
          "From straight and level flight from right to left (left-side loop), pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes straight and level flight where the maneuver began. Repeat from left to right (right-side loop).",
        variations: "Left, Right",
      },
    ],
  },
  {
    id: 3,
    title: "Level 3: Intermediate Sport",
    maneuvers: [
      {
        id: "3.1",
        title: "Stationary Hover (NoseIn)",
        description:
          "Hold a stationary nose-in hover with minimal vertical or lateral movement and hold for 1 minute.",
        variations: "N/A",
      },
      {
        id: "3.2",
        title: "Take-Off (Nose-In)",
        description:
          "Starting from a nose-in orientation, take off straight up from the landing area with a constant rate of climb and minimal lateral movement. Come to a complete stop at a height of approximately 3 feet (1 meter) with minimal vertical and lateral movement.",
        variations: "N/A",
      },
      {
        id: "3.3",
        title: "Constant-Heading Circle (Nose-In)",
        description:
          "From landing area take-off into nose-in orientation, hover for 5 seconds, move the model forward (away from pilot) 15 feet (5 meters) and then move the model in a clockwise circle 30 feet (10 meters) in diameter while keeping the model in the nosein orientation. Stop where you began the circle and hover for 5 seconds, then move backward to the landing area and hover for 5 seconds before landing nose-in with skids completely within the landing area. Repeat the same maneuver in a counterclockwise manner.",
        variations: "N/A",
      },
      {
        id: "3.4",
        title: "Landing (Nose-In)",
        description:
          "From a stationary nose-in hover, land while still nose-in with the skids completely within the landing area.",
        variations: "N/A",
      },
      {
        id: "3.5",
        title: "540-Degree Stall Turn",
        description:
          "From straight and level flight from right to left (left-side stall turn), pull the model vertical with a smooth input of backward elevator until the nose is pointing perpendicular to the horizon. When the model stops climbing, rotate the nose of the model 540 degrees left and allow the model to fall the same distance that it climbed before pulling back into straight and level flight. Repeat a left-side stall turn with a right pirouette and a right-side stall turn with left and right pirouettes.",
        variations:
          "Left-Side/Left-Piro, LeftSide/Right-Piro, Right-Side/LeftPiro, Right-Side/Right-Piro",
      },
      {
        id: "3.6",
        title: "Traveling Rolls",
        description:
          "From straight and level flight from right to left (left-side roll), execute a 360-degree roll to the left. Ensure that the model roles on its long axis rather than in a corkscrew (barrel roll). Repeat with other three variations.",
        variations:
          "Left-Side/Left-Roll, LeftSide/Right-Roll, Right-Side/LeftRoll, Right-Side/Right-Roll",
      },
      {
        id: "3.7",
        title: "Loop with Pirouette at Top",
        description:
          "Start by performing an inside loop as described in 2.7, but when the model is inverted and at the top of the loop, perform a 360-degree left pirouette and then complete the loop. The loop should remain parallel to the flight line at all times during the maneuver. Repeat with other three variations.",
        variations:
          "Left-Side/Left-Piro, LeftSide/Right-Piro, Right-Side/LeftPiro, Right-Side/Right-Piro",
      },
      {
        id: "3.8",
        title: "Immelmann",
        description:
          "With the model flying straight and level from right to left, perform a 1/2 loop to inverted and then perform a 1/2 roll to upright. Then continue flying straight and level after the roll. Repeat from left to right and with both right and left rolls.",
        variations:
          "Left-Side/Left-Roll, LeftSide/Right-Roll, Right-Side/LeftRoll, Right-Side/Right-Roll",
      },
      {
        id: "3.9",
        title: "1/2 Cuban 8",
        description:
          "With the model flying straight and level from right to left, perform a 5/8 loop to inverted on a 45-degree angled downline and then perform a 1/2 roll to upright. Then level the model and continue flying straight and level after the roll. Repeat from left to right and with both right and left rolls.",
        variations:
          "Left-Side/Left-Roll, LeftSide/Right-Roll, Right-Side/LeftRoll, Right-Side/Right-Roll",
      },
      {
        id: "3.10",
        title: "Flying Circle",
        description:
          "Starting from a tail-in hover, rotate the model 90 degrees to a left side-in orientation and fly in a circle back to the starting point while maintaining constant altitude and speed. Repeat in counter-clockwise direction.",
        variations: "CW, CCW",
      },
      {
        id: "3.11",
        title: "Center-Heading Figure 8",
        description:
          "Starting from an eye-level hover, move the model out to a SAFE distance and height. While maintaining constant altitude, speed, and heading, begin a circle to the right with the tail pointing to the center of the circle. As the model reaches the starting point, continue moving, but in the opposite direction with the nose pointing to the center of the circle. Repeat starting the circle to the left.",
        variations: "CW, CCW",
      },
      {
        id: "3.12",
        title: "Autorotation Landing",
        description:
          "Starting from an altitude of no less than 60 feet (20 meters) and on a heading parallel to the flight line, start the autorotation. Maintain a smooth and constant rate of descent directly to a 6-foot (2-meter) landing circle located 20 feet (6 meters) in front of you. The skids of the model must be entirely within the landing circle. The maneuver must be done starting from the right and from the left of the pilot.",
        variations: "Left, Right",
      },
    ],
  },
  {
    id: 4,
    title: "Level 4: Advanced Sport",
    maneuvers: [
      {
        id: "4.1",
        title: "Sustained Inverted Flight",
        description:
          "With the model inverted, fly at least 1 clockwise and 1 counter-clockwise circuit around the flying field.",
        variations: "CW, CCW",
      },
      {
        id: "4.2",
        title: "Sustained Inverted Hover",
        description:
          "With the model inverted and no more than 30 feet (10 meters) above the landing area, hover tail-in and hold for 10 seconds. Repeat nose-in, side-in left, and side-in right.",
        variations: "Tail-In, Nose-In, Nose-Left, NoseRight",
      },
      {
        id: "4.3",
        title: "Inverted Pirouettes",
        description:
          "From a stationary inverted hover, turn the nose of the model 360 degrees either right or left while maintaining constant altitude and control. Repeat in the opposite direction.",
        variations: "CW, CCW",
      },
      {
        id: "4.4",
        title: "Inverted Figure 8",
        description:
          "From level inverted flight parallel to the flight line from right to left, execute a 225-degree right turn to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. Repeat in opposite (reverse start) direction.",
        variations: "Forward (Tail-In), Reverse (NoseIn)",
      },
      {
        id: "4.5",
        title: "Two Consecutive Stationary Rolls",
        description:
          "With the model hovering tail-in at a safe distance, flip the model to right while maintaining constant altitude and heading until it has completed two rolls. Repeat to the left and in nose-in.",
        variations: "Tail-In/Left, Tail-In/Right, NoseIn/Left, Nose-In/Right",
      },
      {
        id: "4.6",
        title: "180-Degree Autorotation",
        description:
          "Starting from an altitude of no less than 60 feet (20 meters) and on a heading parallel to the flight line, start the autorotation. Maintain a smooth and constant rate of descent directly to a 6-foot (2-meter) landing circle located 20 feet (6 meters) in front of you. The model must complete a 180-degree turn after the autorotation started. The skids of the model must be entirely within the landing circle. The maneuver must be done starting from the right and from the left and the turn must be done both clockwise and counter-clockwise.",
        variations:
          "Left-Side/Left-Turn, LeftSide/Right-Turn, Right-Side/LeftTurn, Right-Side/Right-Turn",
      },
      {
        id: "4.7",
        title: "Forward Flips",
        description:
          "With the model hovering tail-in at a safe distance, flip forward to an inverted nose-in hover and hold for 5 seconds then flip forward to a tail-in hover and hold for 5 seconds. Repeat from nose-in.",
        variations: "Tail-In, Nose-In, Nose-Left, NoseRight",
      },
      {
        id: "4.8",
        title: "Backward Flips",
        description:
          "With the model hovering tail-in at a safe distance, flip backward to an inverted nose-in hover and hold for 5 seconds then flip backward to a tail-in hover and hold for 5 seconds. Repeat from nose-in.",
        variations: "Tail-In, Nose-In, Nose-Left, NoseRight",
      },
      {
        id: "4.9",
        title: "Side Flips",
        description:
          "With the model hovering tail-in at a safe distance, flip sidways to an inverted tail-in hover and hold for 5 seconds then flip sideways to a tail-in hover and hold for 5 seconds. Repeat from nose-in and in opposite direction.",
        variations: "Tail-In/Left, Tail-In/Right, NoseIn/Left, Nose-In/Right",
      },
      {
        id: "4.10",
        title: "Two Consecutive Stationary Flips",
        description:
          "With the model hovering tail-in at a safe distance, flip the model forward while maintaining constant altitude and heading until it has completed two flips. Repeat backward and in nose-in.",
        variations:
          "Tail-In/Forward, Tail-In/Backward, Nose-In/Forward, NoseIn/Backward",
      },
    ],
  },
  {
    id: 5,
    title: "Level 5: Basic 3D",
    maneuvers: [
      {
        id: "5.1",
        title: "Sustained Backward Flight",
        description:
          "With the model upright, fly at least 1 clockwise and 1 counter-clockwise circuit around the flying field in the backward direction.",
        variations: "Left, Right",
      },
      {
        id: "5.2",
        title: "Backward Figure 8",
        description:
          "From level upright and backward flight parallel to the flight line from right to left, execute a 225-degree right turn to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. Repeat in opposite (reverse start) direction.",
        variations: "Forward (Tail-In), Reverse (NoseIn)",
      },
      {
        id: "5.3",
        title: "Backward Inside Loop",
        description:
          "From straight and level backward flight from right to left (left-side loop), pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes straight and level flight where the maneuver began. Repeate from left to right (right-side loop).",
        variations: "Left, Right",
      },
      {
        id: "5.4",
        title: "Traveling Backward Rolls",
        description:
          "From straight and level backward flight from right to left (left-side roll), execute a 360-degree roll to the left. Ensure that the model roles on its long axis rather than in a corkscrew (barrel roll). Repeat with other three variations.",
        variations:
          "Left-Side/Left-Roll, LeftSide/Right-Roll, Right-Side/LeftRoll, Right-Side/Right-Roll",
      },
      {
        id: "5.5",
        title: "Sustained Backward Inverted Flight",
        description:
          "With the model inverted, fly at least 1 clockwise and 1 counter-clockwise circuit around the flying field in the backward direction.",
        variations: "Left, Right",
      },
      {
        id: "5.6",
        title: "Backward Inverted Figure 8",
        description:
          "From level inverted and backward flight parallel to the flight line from right to left, execute a 225-degree right turn to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. Repeat in opposite (reverse start) direction.",
        variations: "Forward (Tail-In), Reverse (NoseIn)",
      },
      {
        id: "5.7",
        title: "Inverted Autorotation",
        description:
          "Starting from an altitude of no less than 60 feet (20 meters) and on a heading parallel to the flight line and inverted, start the autorotation. During the autorotation, roll the model left or right to upright. Maintain a smooth and constant rate of descent directly to a 6-foot (2-meter) landing circle located 20 feet (6 meters) in front of you. The skids of the model must be entirely within the landing circle. The maneuver must be done starting from the right and from the left of the pilot.",
        variations: "Left, Right",
      },
      {
        id: "5.8",
        title: "Knife Edge Pirouette",
        description:
          "With the model flying straight and level from right to left, roll to the left (toward the pilot), reduce collective to zero (center stick) and execute at least 1 full pirouette to the right. Exit by rolling to the right, adding collective and fly away upright straight and level. Repeat from left to right, with both piro directions, and both roll directions.",
        variations:
          "Left-Side/Left-Roll/Left-Piro, LeftSide/Right-Roll/Right-Piro, RightSide/Left-Roll/Left-Piro, RightSide/Right-Roll/Right-Piro",
      },
      {
        id: "5.9",
        title: "Death Spiral",
        description:
          "Starting from an altitude of no less than 60 feet (20 meters), roll left to knife edge add forward elevator. The model must complete at least 3 complete tumbles before rolling back to the right to exit the maneuver into an upright hover. Repeat with a right roll entry and backward elevator.",
        variations:
          "Left-Roll/Forward, LeftRoll/Backward, RightRoll/Forward, Right-Roll/Backward",
      },
      {
        id: "5.10",
        title: "Tic Tocs (Skids Out)",
        description:
          "With the model in a tail-in hover, execute at least 5 elevator tic-tocs with the tail down while maintaining altitude and minimizing lateral drift. Repeat with nose-in tail-up elevator and left and right side-in left and right aileron. These are all skids out maneuvers.",
        variations:
          "Nose-Up Elevator, Nose-Down Elevator, Nose-Left Aileron, NoseRight Aileron",
      },
      {
        id: "5.11",
        title: "Vertical 8",
        description:
          "From straight and level upright forward flight from right to left (left-side vertical 8), pull the model vertically through a smooth inside 1/2 loop until the model reaches inverted and then give forward elevator and negative collective to push the model up through a smooth outside full loop. When them model reaches its original inverted point, complete the remaining portion of the inside 1/2 loop. Exit into straight and level flight. Repeate from left to right (right-side vertical 8). Repeat from backward upright flight.",
        variations:
          "Left-Side/Forward, LeftSide/Backward, RightSide/Forward, RightSide/Backward",
      },
      {
        id: "5.12",
        title: "Tumbles",
        description:
          "From straight and level upright flight from right to left, complete at least 3 consecutive backward flips while maintaining altitude and forward motion. Repeat with backward flight and forward flips and from left to right.",
        variations:
          "Left-Side/Forward, LeftSide/Backward, RightSide/Forward, RightSide/Backward",
      },
    ],
  },
  {
    id: 6,
    title: "Level 6: Intermediate 3D",
    maneuvers: [
      {
        id: "6.1",
        title: "Sideways Inside Loop",
        description:
          "From level sideways tail-in flight from right to left (left-side loop), pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes level flight where the maneuver began while maintaining the tail-in heading. Repeat from left to right (right-side loop) and in nose-in.",
        variations: "Tail-In/Left, Tail-In/Right, NoseIn/Left, Nose-In/Right",
      },
      {
        id: "6.2",
        title: "Sideways Outside Loop",
        description:
          "From level sideways inverted tail-in flight from right to left (left-side loop), pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes level flight where the maneuver began while maintaining the tail-in heading. Repeate from left to right (right-side loop) and in nose-in.",
        variations: "Tail-In/Left, Tail-In/Right, NoseIn/Left, Nose-In/Right",
      },
      {
        id: "6.3",
        title: "Sideways Tumbles",
        description:
          "From level sideways tail-in flight from either right to left or left to right, complete at least 3 consecutive forward flips while maintaining the tail-in heading and sideways motion. Repeat backward and in nose-in.",
        variations:
          "Tail-In/Forward, Tail-In/Backward, Nose-In/Forward, NoseIn/Backward",
      },
      {
        id: "6.4",
        title: "Rainbows",
        description:
          "With the model in an upright left side-in hover, execute large backward rainbow (at least 10 feet or 3 meters per half-flip) to a left side-in inverted hover then execute a large forward rainbow back to an upright left side-in hover. This must be done while minimizing lateral drift and executing a crisp stop at each end of the rainbow. Repeat from right side-in.",
        variations: "Left-Side, Right-Side",
      },
      {
        id: "6.5",
        title: "Tic Tocs (Skids In)",
        description:
          "With the model in a nose-in hover, execute at least 5 elevator tic-tocs with the tail down while maintaining altitude and minimizing lateral drift. Repeat with tail-in tail-up elevator and left and right side-in right and left aileron. These are all skids in maneuvers.",
        variations: "Elevator Up, Elevator Down, Aileron Left, Aileron Right",
      },
      {
        id: "6.6",
        title: "4-Point Tic Tocs (Skids Out)",
        description:
          "With the model in a tail-in hover, execute 1 elevator tic-toc with the tail down while maintaining altitude and minimizing lateral drift. During the second half of this elevator tic-toc, smoothly pirouette 90 degrees to the left and perform 1 left aileron tic-toc. Repeat the 90-degree pirouetting after each half-cycle until the model reaches the original tail-down elevator tic-toc orientation. The pilot must perform at least 3 consecutive 360-degree rotations. The tail of the model should appear to tic-tock at each of the four directions of a clock starting at 6 'o clock. Repeat with a right pirouette. These are all skids out maneuvers.",
        variations: "CW, CCW",
      },
      {
        id: "6.7",
        title: "Half-Pirouetting Flips",
        description:
          "With the model in a tail-in hover, execute at least 3 consecutive full forward flips while simultaneously pirouetting to the left. The model must complete 1 full pirouette for every full forward flip completed. Repeat with right pirouettes. A left-pirouetting maneuver requires a clockwise cyclic stir, whereas a right-pirouetting maneuver requires a counter-clockwise stir.",
        variations: "Left, Right",
      },
      {
        id: "6.8",
        title: "Mobius",
        description:
          "With the model in a tail-in hover, execute a mobius with left rudder while maintaining altitude and minimizing lateral drift. The model must complete 1 full pirouette for every full mobius completed. A mobius can be thought of as a half-pirouetting flip that has been stretched out. Alternately, it appears as a Figure 8 with one half performed inverted and a transition to upright for the second half that is executed at the center. Repeat with right pirouettes. A left-pirouetting maneuver requires a clockwise cyclic stir, whereas a right-pirouetting maneuver requires a counter-clockwise stir.",
        variations: "Left, Right",
      },
      {
        id: "6.9",
        title: "Forward Rolling Circles",
        description:
          "From straight and level flight from right to left (clockwise circle), continuously roll the model to the right while executing a flying circle. Keep the circle as round and level as possible. Repeate from left to right with a left roll (counter-clockwise circle).",
        variations: "CW, CCW",
      },
    ],
  },
  {
    id: 7,
    title: "Level 7: Advanced 3D",
    maneuvers: [
      {
        id: "7.1",
        title: "Pirouetting Inside Loop",
        description:
          "From straight and level upright flight from right to left (left-side loop), begin pirouetting to the left and pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes straight and level flight where the maneuver began. During the loop, the model must pirouette continuously and complete at least 2 pirouettes. Repeat from with a right pirouette and from left to right (right-side loop).",
        variations:
          "Left-Side/Left-Piro, LeftSide/Right-Piro, Right-Side/LeftPiro, Right-Side/Right-Piro",
      },
      {
        id: "7.2",
        title: "Pirouetting Outside Loop",
        description:
          "From straight and level inverted flight from right to left (left-side loop), begin pirouetting to the left and pull the model vertically through a smooth loop, keeping the loop as round as possible with appropriate collective inputs until the model resumes straight and level flight where the maneuver began. During the loop, the model must pirouette continuously and complete at least 2 pirouettes. Repeat from with a right pirouette and from left to right (right-side loop).",
        variations:
          "Left-Side/Left-Piro, LeftSide/Right-Piro, Right-Side/LeftPiro, Right-Side/Right-Piro",
      },
      {
        id: "7.3",
        title: "Pirouetting Figure 8",
        description:
          "From level upright flight parallel to the flight line from right to left, begin pirouetting to the left and execute a 225-degree right turn to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. During the Figure 8, the model must pirouette continuously. Repeat in opposite (reverse start) direction and with a right pirouette.",
        variations:
          "Forward/Left-Piro, Forward/RightPiro, Reverse/Left-Piro, Reverse/Right-Piro",
      },
      {
        id: "7.4",
        title: "Inverted Pirouetting Figure 8",
        description:
          "From level inverted flight parallel to the flight line from right to left, begin pirouetting to the left and execute a 225-degree right turn to enter the Figure 8. This will cause the model to cross in front of the pilot at a 45-degree right-side nose-in orientation at which point the model should be turned 270 degrees left to complete the right side of the Figure 8 and end up back in the center. During the Figure 8, the model must pirouette continuously. Repeat in opposite (reverse start) direction and with a right pirouette.",
        variations:
          "Forward/Left-Piro, Forward/RightPiro, Reverse/Left-Piro, Reverse/Right-Piro",
      },
      {
        id: "7.5",
        title: "Double-Pirouetting Flips",
        description:
          "With the model in a tail-in hover, execute at least 3 consecutive full forward flips while simultaneously pirouetting to the left. The model must complete 4 full pirouettes for every full forward flip completed. Repeat with right pirouettes. A left-pirouetting maneuver requires a clockwise cyclic stir, whereas a right-pirouetting maneuver requires a counter-clockwise stir.",
        variations: "Left, Right",
      },
      {
        id: "7.6",
        title: "4-Point Tic Tocs (Skids In)",
        description:
          "With the model in a nose-in hover, execute 1 elevator tic-toc with the tail down while maintaining altitude and minimizing lateral drift. During the second half of this elevator tic-toc, smoothly pirouette 90 degrees to the left and perform 1 left aileron tic-toc. Repeat the 90-degree pirouetting after each half-cycle until the model reaches the original tail-down elevator tic-toc orientation. The pilot must perform at least 3 consecutive 360-degree rotations. The tail of the model should appear to tic-tock at each of the four directions of a clock starting at 6 'o clock. Repeat with a right pirouette. These are all skids out maneuvers.",
        variations: "CW, CCW",
      },
      {
        id: "7.7",
        title: "Traveling Double-Pirouetting Flips",
        description:
          "With the model in a tail-in hover, execute continuous left double-pirouetting flips while moving the model to the left 30 feet (10 meters), up 30 feet (10 meters), to the right 60 feet (20 meters), down 30 feet (10 meters), and finally back to the left 30 feet (10 meters). Repeat with right pirouettes and in opposite direction. A left-pirouetting maneuver requires a clockwise cyclic stir, whereas a right-pirouetting maneuver requires a counter-clockwise stir.",
        variations:
          "Left-Piro/CW, Left-Piro/CCW, Right-Piro/CW, Right-Piro/CCW",
      },
      {
        id: "7.8",
        title: "Pirouetting Autorotation",
        description:
          "Starting from an altitude of no less than 60 feet (20 meters) and on a heading parallel to the flight line and upright, start the autorotation. During the autorotation, fully pirouette the model left or right for at least 3 consecutive 360-degree rotations. Maintain a smooth and constant rate of descent directly to a 6-foot (2-meter) landing circle located 20 feet (6 meters) in front of you. The skids of the model must be entirely within the landing circle. The maneuver must be done starting from the right and from the left of the pilot.",
        variations: "Left, Right",
      },
      {
        id: "7.9",
        title: "Pirouetting Tic-Tocs (Skids Out)",
        description:
          "With the model in a tail-in hover, begin the maneuver by executing elevator tic-tocs with the tail down and then transition into continuously left pirouetting tic-toc. The model must complete 1 full pirouette per tic-toc cycle while maintaining altitude and minimizing lateral drift. The pilot must perform at least 5 consecutive pirouetting tic-tocs. Repeat with a right pirouette. This is a skids out maneuver.",
        variations: "Left, Right",
      },
    ],
  },
];

export const tips = [
  "Master the 10-in-a-row rule on the simulator before trying IRL.",
  "Add wind and gusts to your simulator for realism and micro-corrections.",
  "Practice the 'Bail-Out' drill: instantly leveling the swashplate from panic positions.",
  "Simulate with the camera zoomed out to replicate real field distance.",
  "Focus on consistency in the sim; if you crash, the counter resets to zero.",
  "Use the 3-Second Rule: if orientation is lost, punch collective immediately.",
  "Call your maneuvers out loud (e.g., 'Entering turn') to stay ahead of the heli.",
  "Limit training flights to 3-4 minutes to combat 'brain fade'.",
  "Fly new maneuvers at 'Two-Mistake Altitude' for safer recovery.",
  "When flying, focus on the angle of 'the disc', not the canopy.",
  "Consciously check your grip—avoid crushing the sticks for smoother input.",
  "If you use pinch grip, it often offers more precise cyclic control.",
  "Perform the 'Clock Drill' (tail at 1, 2, 3 o'clock) to fix orientation blind spots.",
  "Establish a minimum 'Hard Deck' altitude and always abort before hitting it.",
  "Ensure blades are perfectly balanced; vibration is the enemy of the gyro.",
  "Fly calm, not tense—if you're shaking or twisting the transmitter, you're outside your zone.",
  "If nerves spike, simplify the routine and reset your confidence first.",
  "Do 1–3 relaxed warm-up flights before pushing any new moves.",
  "Stop immediately if focus fades; take a proper 20-minute break.",
  "Attack your weaknesses directly—avoidance makes them harder.",
  "Break every maneuver into smaller chunks and master each piece.",
  "Always know your bailout plan before attempting a move.",
  "Fly in varied wind directions so you don't build 'wind crutches'.",
  "If a setup feels wrong, back off and reset instead of forcing the move.",
  "Don't repeat a bad attempt—pause, rethink the entry, then try again.",
  "Record flights and compare against your own past flights, not others.",
  "Hydrate and eat properly; poor physiology kills precision and focus.",
  "Don't fly new moves when tired, stressed, or unfocused—it's wasted reps.",
  "Use micro-goals to break plateaus instead of trying everything at once.",
];
