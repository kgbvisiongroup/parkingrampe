import type { Access } from 'payload'

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)
