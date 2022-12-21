
import dotenv from "dotenv";
dotenv.config()

import { generateAccessToken, verifyTokenExpires } from "./src/util/jwt";

verifyTokenExpires("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJhc2Rhc2RmIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTY3MDE2NjM2NiwiZXhwIjoxNjcwMTY2MzY3fQ.jM9bnef43Ez36RWZH9Hju6D3f57r4dH0N_2OwIU30W8")

