import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Users, Shield, Clock } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Shield,
    title: "Trusted & Reliable",
    description: "Over 15 years of experience in real estate with thousands of satisfied clients."
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the top real estate agency in the region for 5 consecutive years."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our certified professionals provide personalized service and expert guidance."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you with all your real estate needs."
  }
]

const stats = [
  { number: "500+", label: "Properties Sold" },
  { number: "1000+", label: "Happy Clients" },
  { number: "15+", label: "Years Experience" },
  { number: "50+", label: "Cities Covered" }
]

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Trusted Partner in
                <span className="text-primary block">Real Estate Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Premier Deals, we understand that finding the perfect property is more than 
                just a transaction—it&apos;s about finding your dream home, making smart investments, 
                and building your future.
              </p>
              <p className="text-gray-600 mb-8">
                With over 15 years of experience and a team of certified professionals, we&apos;ve 
                helped thousands of families find their perfect homes and investors build their 
                portfolios. Our commitment to excellence, transparency, and personalized service 
                sets us apart in the real estate industry.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button size="lg" className="bg-primary hover:bg-primary-hover">
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Professional real estate team"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 