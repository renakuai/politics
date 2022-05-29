import { useEffect, useState, useRef, useMemo } from 'react';
import styles from '../styles/App.module.css';
import * as d3 from "d3";
import { scaleBand } from 'd3';
import { useOutletContext } from "react-router-dom";
import useResizer from '../hooks/Resizer.js'

function DivergentChart() {
  const { politiciansData } = useOutletContext();
  const barChart = useRef(null);
  const width = useResizer(barChart)
  const [height, setHeight] = useState(11350);
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    party: '',
    state: '',
    dollars_gun_control: '',
    dollars_gun_rights: '',
    xPos: '',
    yPos: '',
  })

  const scaleX = d3.scaleLinear()
    .domain(findExtent())
    .range([(((width / 2) * -1) + 80), ((width / 2) - 80)])

  const scaleY = d3.scaleLinear()
    .domain([0, (politiciansData.length - 1)])
    .range([100, height - 24])

  function findExtent() {
    let filteredArray = [];
    politiciansData.map((d) => (
      filteredArray.push(d.num_gun_rights)
    ))
    politiciansData.map((d) => (
      filteredArray.push(d.num_gun_control)
    ))
    const extent = d3.extent(filteredArray)
    return [-extent[1], extent[1]];
  }

  function fillColor(party) {
    if (party === 'R') {
      return '#EC4997';
    }
    if (party === 'D') {
      return '#347EC3';
    }
    else {
      return '#CBCFDB'
    }
  }

  function showTooltip(e) {
    const name = e.target.id;
    const obj = politiciansData.filter((d) => d.name === name);
    const index = politiciansData.findIndex((item) => item === obj[0]);
    setTooltip({
      visible: true,
      name: name,
      party: obj[0].party,
      state: obj[0].state,
      dollars_gun_control: obj[0].dollars_gun_control,
      dollars_gun_rights: obj[0].dollars_gun_rights,
      xPos: e.clientX,
      yPos: scaleY(index),
    })
  }


  return (
    <div ref={barChart}>
      <header>
        <h3>Chart of all current congressmen and the the total money given to their campaign or leadership PAC from gun rights or gun control PACs or individuals (back to 1989 for members for whom that is relevant).
        </h3>
      </header>
      {width !== undefined &&
        <div className={styles.Tooltip__wrapper} styles={"width:" + width + 'px' + ";" + "height:" + height + 'px'}>
          {tooltip.visible && <div
            className={styles.Tooltip}
            style={{
              position: 'absolute',
              left: tooltip.xPos - 50,
              top: tooltip.yPos - 120
            }}
          >
            <p className={styles.Tooltip__title}>{tooltip.name} ({tooltip.party}, {tooltip.state})</p>
            <p>$ from Gun Rights Groups: <b>{tooltip.dollars_gun_rights}</b></p>
            <p>$ from Gun Control Groups: <b>{tooltip.dollars_gun_control}</b></p>
          </div>}
          <svg height={height} width={width} y="100">
            <text
              className={styles.XLabel}
              x={Math.floor((width / 4.5))}
              textAnchor="middle"
              y="56"
            >Money Received from</text>
            <text
              className={styles.XLabel}
              x={Math.floor((width / 4.5))}
              textAnchor="middle"
              y="72"
            >Gun Control groups</text>
            <text
              className={styles.XLabel}
              x={Math.floor(((width / 4.5) * 3.5))}
              textAnchor="middle"
              y="56"
            >Money Received from</text>
            <text
              className={styles.XLabel}
              x={Math.floor((width / 4.5) * 3.5)}
              textAnchor="middle"
              y="72"
            >Gun Rights Groups</text>
            {politiciansData.map((d, i) => (
              <g id={d.name}
                key={d.name + '_5'}
                onMouseEnter={(e) => showTooltip(e)} onMouseLeave={() => setTooltip({
                  ...tooltip,
                  visible: false,
                  name: '',
                })}>
                <rect
                  className={tooltip.name === d.name ? `${styles.Hover}` : null}
                  id={d.name}
                  key={d.name}
                  height="6"
                  x={String((width / 2) + 124)}
                  y={scaleY(i)}
                  width={Math.floor((scaleX(d.num_gun_rights)))}
                  fill={fillColor(d.party)}
                />
                <rect
                  className={tooltip.name === d.name ? `${styles.Hover}` : null}
                  id={d.name}
                  key={d.name + '_2'}
                  height="6"
                  x={String((width / 2) + (scaleX(d.num_gun_control) - 124))}
                  y={scaleY(i)}
                  width={Math.floor((scaleX(d.num_gun_control) * -1))}
                  fill={fillColor(d.party)}
                />
              </g>
            ))}
            <g className={styles.Labels}>
              {politiciansData.map((d, i) => (
                <text
                  className={tooltip.name === d.name ? `Label ${styles.Hover}` : 'Label'}
                  id={d.name}
                  key={d.name + '_3'}
                  x={String(width / 2)}
                  textAnchor="middle"
                  y={scaleY(i) + 8}
                  onMouseEnter={(e) => showTooltip(e)}
                  onMouseLeave={() => setTooltip({
                    ...tooltip,
                    visible: false
                  })}
                >{d.name + '(' + d.party + ', ' + d.state + ')'}</text>
              ))}
              <rect
                height={height}
                width="1"
                x={((width / 2) - 124)}
                y="90"
                fill="#D1D1D1"
              />
              <rect
                height={height}
                width="1"
                x={((width / 2) + 124)}
                y="90"
                fill="#D1D1D1"
              />
            </g>
          </svg>
        </div>}
    </div >
  );
}

export default DivergentChart;