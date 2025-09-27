import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
  TextEncoder;
(global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
  TextDecoder;
