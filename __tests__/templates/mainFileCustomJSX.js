module.exports.default = `import React from 'react'
import PropTypes from 'prop-types'

/** {{ componentName }} */
function {{ componentName }}() {
  return (
    <div>
    <CustomComponent/>
    </div>
  )
}

{{ componentName }}.propTypes = {}

export default {{ componentName }}
`
