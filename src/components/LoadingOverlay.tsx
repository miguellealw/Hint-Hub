import { LoadingOverlay as LoadingOverlayMantine } from "@mantine/core"
import { type ReactPropTypes } from "react"

const LoadingOverlay = ({ visible, ...props }: { visible: boolean, props?: ReactPropTypes }) => {
  return (
    <LoadingOverlayMantine visible={visible} overlayBlur={2} {...props} />
  )
}

export default LoadingOverlay;