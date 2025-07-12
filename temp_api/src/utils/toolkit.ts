import bcrypt from "bcryptjs";

export const addSeasoning = (intensity?: number) => bcrypt.genSaltSync(intensity || 8);