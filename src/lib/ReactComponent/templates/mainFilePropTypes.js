const templateString = `

import React from 'react'
import PropTypes from 'prop-types'

/** {{ componentName }} */
function {{ componentName }}() {
  return (
    <div>
    <h1>{{ componentName }}</h1>
    </div>
  )
}

{{ componentName }}.propTypes = {}

export default {{ componentName }}
`

export default templateString
