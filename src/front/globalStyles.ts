import { css } from "lit-element";

export default css`
.flex {
  display: flex;
  align-items: center;
}
.title {
  font-weight: 500;
  font-size: 32px;
}
mwc-icon {
  cursor: help;
  margin-left: 4px;
}
mwc-slider {
  width: 100%;
}
#results {
  margin: 30px 0 0 0;
}

#name, #value {
  padding: 12px;
  flex: 1;
  text-align: center;
}

#name {
  background-color: #e0e0e0;
}

#value {
  color: white;
  background-color: black;
}
#value[colors] {
  background-color: red;
}
#value[colors][greater] {
  background-color: green;
}
`