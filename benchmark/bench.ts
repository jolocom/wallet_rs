import b from 'benny'

import { Buffer } from 'buffer'
import bindings from '../ts/bindings'

const encodePassword = (password: string) => Buffer.from(password, 'utf-8').toString('base64')

const encodedWallets = {
  alice: "0t22l-qkGqDvi0cnIuU35KWCgYdt9pvH1a2oesPsPdbdXzV4VyLCd_H1V-Dqtf_otGOtCZ5ACH60K4eCEWnw6qMRUMNq1kVsnyC0qUbF7GpRi_ZCjU3uL1NN3jMchsCyBrUdDlU2qzVQWvPK8P4uIDw_vsCEjnkZzB41mTrJkDnTD4wcRzjYONO-Lt62e80rFY8C6p0y22CwYfcR3vYHyE5BYNcvrarMhu0HGUFHfdtpsRVVR5Q2ZqA1tGaSAJRgvOeZluBhxQGBUZ9tz9AiWtRljSe_FKRtB1sDBzh0IcZtzQXwZ8ggSzykiWmzuHS8DybYbWKWdisMtqVpdsHpzr_PU3xETBD7NHdZIaM8fNbA5CUq9LcBgwTIvI5udl7Mr5-AxX3QHUCm3AOJVUKV_N3cZHoaVwQ3AiCGT_2GyIF_20C0nY4FI3cV7rhtFHbFDMN3rC-aNDa65Y6wSc6Ul-Dt4lG9u1XXVH-y_RrNzInZG7QStUjqkJPu3CUDZC1_H7vpNQe3rMLk_jOqa4oueYhW1ZNOqC4yQO0n8ld1wrx2QYXzyt0fpkFacs0cG92re172qWrmJPu3OvbfEDaquJgV9k99n5uqyhyhSIkLhzuwWi4Pfy92QLTprURmOxpUVdz-ET9lpRebkFTZ-JKCw0aKEdoYCbYA00VkP34_oJlabDIF-iL-SQSmkgdRt297Kk6DM5GV6qRiTrF_u49R7s3o-T1HsX2TJZZerYmMRAyNnCBAY0rQ0dn8Wc8rxNVhJ7Wd57LVAG9_25aMqjCk78sj9mqLTB2aZ-C73hXcvSRlw5Kwd10RvqVZYCFjqc-_WGjlc5X74aDxH10KT7BY9RfYupR64chLX86M8JDj7zo6Jw==",
  bob: "jEq0_YQlP0RMes09TTIOh9guxb7KmNueRVqdM0JSKtyGeXu3zXPJdt7pc7b_XPLeEu3BgOgkqEUx-6gS67Yyem-jVlw0PpFJ9oxlEncGlYYbgZyaXfEe6S5zuxAXBYKld1-PQIWG2V5ZFemoHVQ2DA7lUnNQll4l_Kxtw9wba3lETdY85NnB6r49vgzcigSlPhjW9fNezdKBpUmURSUpQBqJbedvVCTw151hiRPVpbL1572i85cxPRdiUHRpw9T1tsEhKObM9dgEBO-o8YfPYVhzT0AW7cY8XavBWoAumZ13Yx-M0RLzDoMnsIItEJuMjtjt6LfTuIt5Yu0hHu4KzJWeLQb0U2Kbp7pr_n9g601eGqorn5rbJO9TrhG_Ky_YzJzlz_rfV143KKfl_V0eswYoN_b37WiqFX8aRF3IPoJ_Jm8XpsGSgOKafXcWbCwAsgZTOmXjTnesWi6Xb5Aqm1dDab8wATdoaEuT4nBQn402sNqJ-0Cbw9fK2HoH8Si_3qgTU9qdVQF_Q5krhFRq-SaM1JGgeFwB-FP-nQ0yIpDsFX-5RGfPsry-MuOfIwyKhZQpT0uiBOpok1SqXiJLuvXAEbvtSV3oAeddXNq2f6Kl5ipDSHcpR0GqAUOIjGIZMsTiQcqWpwsDedN-WvbQYbZ3p78fnqIymfQm5jmecdvG1MVX_2hbUPA9lUzE2H2y3osuoL5u_zi1wfjXNYaEFv7blimM3mUr3_QPikUwglAzcWX-oAVPPnBxvRQEanQWbvavYGDtpjk_AM2_fcosh1j5vavWxPVHrvFDN_EeetFD2uO-KptnoK4WKv5PphiS7lw8GOmlPFWkAd8WBu7U9ixByTmTWXVzHskFvHU9VS8=",
}

async function run() {
  await b.suite(
    'Attach and detach',

    b.add('Wallet attach', () => {
      const password = encodePassword('alice')

      return () => {
        const wallet = {
          attach: bindings.attach,
        }

        wallet.attach(encodedWallets.alice, 'alice', password)
      }
    }),

    b.add('Wallet attach and detach', () => {
      const password = encodePassword('bob')
      const wallet = {
        attach: bindings.attach,
      }
      wallet.attach(encodedWallets.bob, 'bob', password)

      return () => {
        const wallet = {
          attach: bindings.attach,
          detach: bindings.detach,
        }

        wallet.attach(encodedWallets.bob, 'bob', password)
        wallet.detach(password)
      }
    }),

    b.cycle(),
    b.complete(),
  )
}

run().catch((e) => {
  console.error(e)
})
