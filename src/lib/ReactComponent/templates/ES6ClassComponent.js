const templateString = `
import React, { Component } from 'react'

/** {{ componentName }} */
class {{ componentName }} extends Component {
  render(){
    return (
    <div>{{ componentName }}</div>
    )
  }
}
export default {{ componentName }}
`
export default templateString
