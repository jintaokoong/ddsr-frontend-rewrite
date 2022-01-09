import { PropsWithChildren } from 'react'
import { ListItemText } from '@mui/material'
import { grey } from '@mui/material/colors'

const songRequestDoneStyle = {
  textDecorationLine: 'line-through',
  color: grey[600],
}
export const SongRequestTitle = ({
  done,
  children,
}: PropsWithChildren<{ done: boolean; secondary: string | undefined }>) => (
  <ListItemText
    sx={done ? songRequestDoneStyle : undefined}
    primary={children}
  />
)
