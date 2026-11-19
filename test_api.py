import unittest

from fastapi.testclient import TestClient

import main


class ApiTests(unittest.TestCase):
    def setUp(self):
        main.spots[:] = [{"id": 1, "name": "Campus Point", "tip": "Go for the sunset."}]
        main.next_id = 2
        self.client = TestClient(main.app)

    def test_crud(self):
        self.assertEqual(self.client.get("/spots").json()[0]["name"], "Campus Point")
        response = self.client.post("/spots", json={"name": " The lagoon ", "tip": "Look for herons."})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["name"], "The lagoon")
        spot_id = response.json()["id"]
        response = self.client.patch(f"/spots/{spot_id}", json={"tip": "Bring binoculars."})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["tip"], "Bring binoculars.")
        response = self.client.delete(f"/spots/{spot_id}")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.content, b"")
        self.assertEqual(self.client.delete(f"/spots/{spot_id}").status_code, 404)
        self.assertEqual(self.client.patch("/spots/999", json={"tip": "Hello"}).status_code, 404)

    def test_validation(self):
        for body in [{}, {"name": " ", "tip": "Hello"}, {"name": "a" * 61, "tip": "Hello"},
                     {"name": "Lagoon", "tip": " "}, {"name": "Lagoon", "tip": "a" * 201}]:
            with self.subTest(body=body):
                self.assertEqual(self.client.post("/spots", json=body).status_code, 422)
        self.assertEqual(self.client.patch("/spots/1", json={}).status_code, 422)
        self.assertEqual(self.client.patch("/spots/nope", json={"tip": "Hello"}).status_code, 422)

    def test_cors(self):
        response = self.client.options("/spots", headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type,authorization",
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "*")
        self.assertIn("POST", response.headers["access-control-allow-methods"])
        self.assertIn("authorization", response.headers["access-control-allow-headers"])
        response = self.client.post("/spots", json={}, headers={"Origin": "http://localhost:5173"})
        self.assertEqual(response.headers["access-control-allow-origin"], "*")

    def test_interactive_docs(self):
        self.assertEqual(self.client.get("/docs").status_code, 200)
        schema = self.client.get("/openapi.json").json()
        self.assertIn("post", schema["paths"]["/spots"])


if __name__ == "__main__":
    unittest.main()
