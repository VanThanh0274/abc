import { jwtDecode } from "jwt-decode";
export function Gettoken() {
    let token = localStorage.getItem("token");
    return token;
}
export function Getiduser() {
    const token = Gettoken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.nameid || null; // tùy thuộc vào token của bạn
    } catch (error) {
        return null;
    }
}
export function getRole() {
  const token = Gettoken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    return null;
  }
}