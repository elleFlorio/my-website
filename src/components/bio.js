/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter,
            gitHub,
            linkedIn
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        Powered by <strong>{author}</strong>. 
        Computer Science PhD, passionate about Distributed Systems.
        Functional Programming Enthusiast. 
        Krav Maga black belt.
        {` `}
        <p>
          <a href={`https://twitter.com/${social.twitter}`}> Twitter </a> | <a href={`https://github.com/${social.gitHub}`}> GitHub </a> | <a href={`https://www.linkedin.com/in/${social.linkedIn}`}> LinkedIn </a>
        </p>
      </p>
    </div>
  )
}

export default Bio
