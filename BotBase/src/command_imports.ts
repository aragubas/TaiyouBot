import { uuid } from "./Commands/uuid";
import commandsList from "./Command"
import { random_cat } from "./Commands/random_cat";
import { ban } from "./Commands/ban";
import { unban } from "./Commands/unban";
import { kick } from "./Commands/kick";
import { ceira } from "./Commands/ceira";
import { reverse_text } from "./Commands/reverse_text";
import { hello } from "./Commands/hello";
import { clear } from "./Commands/clear";
import { ping } from "./Commands/ping";
 
export const Commands: commandsList[] = [uuid, random_cat, ban, unban, kick, ceira, reverse_text, hello, clear, ping]