// Example Kotlin file with poor formatting
fun main() {
  val greeting = "Hello, World!"
  println(greeting)
  val numbers = listOf(1, 2, 3, 4, 5)
  numbers.forEach { num -> println("Number: $num") }
}

data class Person(val name: String, val age: Int) {
  fun introduce() = println("Hi, I'm $name and I'm $age years old")
}
