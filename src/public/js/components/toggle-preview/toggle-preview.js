import React, { PropTypes } from 'react'
import classNames from 'classnames'

const TogglePreview = ({ isGridView, showList, showGrid }) => {

  const listClassNames = classNames({
    'of-toggle-preview-btn': true,
    'of-toggle-preview-list': true,
    'of-toggle-preview-btn--active': !isGridView
  })

  const gridClassNames = classNames({
    'of-toggle-preview-btn': true,
    'of-toggle-preview-grid': true,
    'of-toggle-preview-btn--active': isGridView
  })

  return (
    <div className="of-toggle-preview-wrapper">
      <div className="of-toggle-preview">
        <div onClick={showList} className={listClassNames}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="32">
            <g transform="matrix(1,0,0,1,10,7)">
              <rect x="0" y="0" width="17px" height="4px"></rect>
              <rect x="0" y="6px" width="17px" height="4px"></rect>
              <rect x="0" y="12px" width="17px" height="4px"></rect>
            </g>
          </svg>
        </div>
        <div onClick={showGrid} className={gridClassNames}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="32">
            <g transform="matrix(1,0,0,1,8,6)">
              <rect x="0" y="0" width="8px" height="8px"></rect>
              <rect x="10px" y="0" width="8px" height="8px"></rect>
              <rect x="10px" y="10px" width="8px" height="8px"></rect>
              <rect x="0px" y="10px" width="8px" height="8px"></rect>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

TogglePreview.propTypes = {
  showList: PropTypes.func.isRequired,
  showGrid: PropTypes.func.isRequired,
  isGridView: PropTypes.bool.isRequired
}

export default TogglePreview
